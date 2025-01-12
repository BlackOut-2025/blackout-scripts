// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

struct UserOperation {
    bytes callData; // 실행하고자 하는 함수 호출 데이터
    bytes sessionKey; // 세션 키
}

contract EntryPoint is ChainlinkClient {
    event UserOperationEvent(
        address indexed sender,
        uint256 nonce,
        bytes callData
    );
    event DeployedAccount(address wallet, bytes initCode);
    event RequestWalletAddress(bytes32 indexed requestId);
    event WalletAddressUpdated(
        bytes32 indexed requestId,
        address walletAddress
    );

    address public externalWalletAddress;
    // ----------- Chainlink 관련 변수 -----------
    address private oracle; 
    bytes32 private jobId;
    uint256 private fee; 

    constructor(
        address _link,
        address _oracle,
        bytes32 _jobId,
        uint256 _fee
    ) {
        _setChainlinkToken(_link);
        oracle = _oracle;
        jobId = _jobId;
        fee = _fee;
    }

    // ========== Chainlink 오라클 연동 함수 ==========

    function requestExternalWalletAddress(bytes calldata sessionKey)
        public
        returns (bytes32 requestId)
    {
        Chainlink.Request memory request = _buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        request.add(
            "post",
            "https://uqu35pq3hcluifqq3edczgy3n40fibzd.lambda-url.us-east-1.on.aws/"
        );
        request.add("body", '{sessionId:"' + sessionKey + '"}');
        requestId = _sendChainlinkRequestTo(oracle, request, fee);

        emit RequestWalletAddress(requestId);
    }

    function fulfill(bytes32 _requestId, bytes memory walletAddressBytes)
        public
        recordChainlinkFulfillment(_requestId)
    {
        address walletAddr;
        assembly {
            walletAddr := mload(add(walletAddressBytes, 20))
        }
        externalWalletAddress = walletAddr;

        emit WalletAddressUpdated(_requestId, walletAddr);
    }

    function handleOp(UserOperation calldata userOp) external payable {
        if (!_accountExists(userOp.sessionKey)) {
            address deployed = _deployAccount(userOp.sessionKey);
            emit DeployedAccount(deployed, userOp.initCode);
        }

        // 5. 실제 계좌의 callData 실행 (계좌 컨트랙트의 로직을 호출)
        (bool success, ) = userOp.sender.call(userOp.callData);
        require(success, "User operation failed");

        emit UserOperationEvent(userOp.sender, userOp.nonce, userOp.callData);
    }

    function _accountExists(bytes calldata sessionKey)
        internal
        view
        returns (bool)
    {
        // extcodesize는 주소에 배포된 코드의 크기를 반환합니다.
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    function _deployAccount(bytes calldata sessionKey)
        internal
        returns (address deployedAccount)
    {
        assembly {
            // 메모리 위치 할당: initCode의 시작 위치와 크기
            let encodedData := add(sessionKey.offset, 0)
            let encodedSize := mload(sessionKey.offset)
            deployedAccount := create(0, encodedData, encodedSize)
        }
        require(deployedAccount != address(0), "Account deployment failed");
    }
}

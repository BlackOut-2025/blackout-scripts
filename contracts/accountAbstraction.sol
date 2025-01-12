// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract SimpleAccount {
    address public owner;
    uint256 public nonce;
    address public entryPoint;

    event Executed(address target, uint256 value, bytes data);

    /**
     * @notice 생성자: 소유자와 EntryPoint 주소를 저장합니다.
     * @param _owner 계좌 소유자 주소
     * @param _entryPoint EntryPoint 컨트랙트 주소
     */
    constructor(address _owner, address _entryPoint) {
        owner = _owner;
        entryPoint = _entryPoint;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /**
     * @notice 사용자가 직접 지갑에서 실행할 수 있는 함수 (예: 일상적 거래)
     * @param target 호출할 대상 주소
     * @param value 전송할 ETH 양
     * @param data 호출할 함수 데이터
     */
    function execute(address target, uint256 value, bytes calldata data) external onlyOwner {
        (bool success, ) = target.call{value: value}(data);
        require(success, "Execution failed");
        emit Executed(target, value, data);
    }

    /**
     * @notice EIP-4337에 따라 EntryPoint에서 호출하여 서명을 검증하는 함수.
     *         실제 구현에서는 ECDSA.recover 등을 통해 서명을 검증해야 합니다.
     * @param userOpHash 사용자 오퍼레이션 해시 값(예: EIP-712 해시)
     * @param signature 오퍼레이션 서명
     * @return true이면 서명 검증 통과 (여기서는 단순히 true 반환)
     */
    function validateUserOp(bytes calldata userOpHash, bytes calldata signature) external view returns (bool) {
        // 실제 구현 예:
        // address recovered = ECDSA.recover(userOpHash, signature);
        // require(recovered == owner, "Invalid signature");
        // return true;
        // 본 예제에서는 단순화하여 항상 true 반환
        return true;
    }

    // fallback 및 receive 함수를 통해 ETH 수신 가능
    receive() external payable {}
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicketManager {
    // 티켓 구조체
    struct Ticket {
        uint256 ticketId;
        uint256 price;
        bool isUsed;
        uint256 purchaseDate;
    }

    // 사용자 주소별 티켓 매핑
    mapping(address => Ticket[]) private userTickets;
    
    // 티켓 가격
    uint256 public constant TICKET_PRICE = 0.01 ether;
    
    // 이벤트
    event TicketPurchased(address buyer, uint256 ticketId, uint256 purchaseDate);

    // 티켓 구매 함수
    function purchaseTicket() public payable {
        require(msg.value == TICKET_PRICE, "Incorrect ticket price");
        
        uint256 newTicketId = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, userTickets[msg.sender].length)));
        
        Ticket memory newTicket = Ticket({
            ticketId: newTicketId,
            price: msg.value,
            isUsed: false,
            purchaseDate: block.timestamp
        });
        
        userTickets[msg.sender].push(newTicket);
        
        emit TicketPurchased(msg.sender, newTicketId, block.timestamp);
    }

    // 사용자의 모든 티켓 조회
    function getMyTickets() public view returns (Ticket[] memory) {
        return userTickets[msg.sender];
    }

    // 특정 티켓 조회
    function getTicketById(uint256 ticketId) public view returns (Ticket memory) {
        Ticket[] memory tickets = userTickets[msg.sender];
        for (uint i = 0; i < tickets.length; i++) {
            if (tickets[i].ticketId == ticketId) {
                return tickets[i];
            }
        }
        revert("Ticket not found");
    }
}
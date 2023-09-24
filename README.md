# SG Market - Server
Prototype submission for NDI's TAP
## Table of Contents

## Table of Contents
- [SG Market - Server](#sg-market---server)
  - [Table of Contents](#table-of-contents)
  - [Table of Contents](#table-of-contents-1)
  - [Introduction](#introduction)
  - [Problem Statement](#problem-statement)
  - [Proposed Solution](#proposed-solution)
  - [Getting Started](#getting-started)
  - [Demo](#demo)
  - [Documentation](#documentation)
    - [User Component](#user-component)
    - [Model](#model)
    - [Routes](#routes)
      - [Get User by UUID](#get-user-by-uuid)
      - [Get User by ID](#get-user-by-id)
      - [Create User](#create-user)
      - [Update User by UUID](#update-user-by-uuid)
      - [Delete User by UUID](#delete-user-by-uuid)
  - [Chat and Message Component](#chat-and-message-component)
    - [Chat Model](#chat-model)
    - [Message Model](#message-model)
    - [Routes](#routes-1)
      - [Create Message](#create-message)
      - [Get Chat by listingId (unique to user-pair and item)](#get-chat-by-listingid-unique-to-user-pair-and-item)
      - [Get Chats by UUID](#get-chats-by-uuid)
      - [Send Message as a buyer](#send-message-as-a-buyer)
      - [Send Message as a seller](#send-message-as-a-seller)
      - [Get Messages by ListingId (Gets message history/log)](#get-messages-by-listingid-gets-message-historylog)
  - [Listing Component](#listing-component)
    - [Listing Model](#listing-model)
    - [Routes](#routes-2)
      - [Create Listing](#create-listing)
      - [Get Listing by ID](#get-listing-by-id)
      - [Get All Listings by Seller ID](#get-all-listings-by-seller-id)
  - [Reservation Component](#reservation-component)
    - [Reservation Model](#reservation-model)
    - [Routes](#routes-3)
      - [Create Reservation](#create-reservation)
      - [Update Reservation by ID](#update-reservation-by-id)
      - [Update Reservation Approval Status](#update-reservation-approval-status)
      - [Update Reservation Payment Status](#update-reservation-payment-status)
  - [SuspiciousActivityLog Component](#suspiciousactivitylog-component)
    - [SuspiciousActivityLog Model](#suspiciousactivitylog-model)
    - [Routes](#routes-4)
      - [Get Suspicious Activity Log by ID](#get-suspicious-activity-log-by-id)
      - [Get All Suspicious Activity Logs by User UUID](#get-all-suspicious-activity-logs-by-user-uuid)
      - [Create Suspicious Activity Log](#create-suspicious-activity-log)
      - [Delete Suspicious Activity Log by ID](#delete-suspicious-activity-log-by-id)
      - [Get Suspicious Activity Logs by Date Range](#get-suspicious-activity-logs-by-date-range)
  - [License](#license)
  - [Contact](#contact)
  
## Introduction

SG Market is a solution aimed at enhancing the security and integrity of Singapore's e-commerce ecosystem by integrating SingPass, NDI's Verify system, and implementing biometric authentication, specifically Identiface, into e-commerce platforms, with a particular focus on B2B platforms.

## Problem Statement

In Singapore's dynamic e-commerce landscape, preserving the integrity and trustworthiness of marketplaces, while ensuring peace of mind for all participants, is a formidable challenge. A critical concern is the need to effectively mitigate the escalating threats of fraudulent activities, including the widespread illegal resale of items such as concert tickets.

## Proposed Solution

To address these challenges, we propose the following solutions:

- **SingPass Integration**: Simplify user registration by utilizing SingPass, a trusted digital identity platform.

- **Suspicious Activity Detection**: Our system will monitor user activities and flag suspicious activities. 

- **Biometric Authentication**: Flagged users will undergo biometric verification during login using Identiface, ensuring the identity of the user.

- **Transaction Security**: NDI's Verify system will be used during transactions to confirm the exchange of goods before the release of payment, minimizing remote scams.

- **Privacy Compliance**: We adhere to strict privacy standards and won't access users' personal information. Suspicious activities can be reported to NDI for further investigation.

- **Enhanced Verification Methods**: We recommend expanding biometric verification options to include voice and thumbprint recognition for added security.

This solution is vital for establishing a secure and trustworthy digital marketplace, promoting the digitization of trade in Singapore.

## Getting Started

To run this project locally, follow these steps:

1. Navigate to the project directory.
2. Run `npm install` to install dependencies.
3. Run `npm run start` to start the server.
4. The server can be accessed locally at `http://localhost:8080/`.

Alternatively, you can access a deployed version of the project at [https://sgmarket-api.onrender.com/](https://sgmarket-api.onrender.com/).

A Postman collection and environments have also been provided for ease of testing (located in documentation folder).

Do note that the default routes are `url.com/api/...`
## Demo

For a live demo of SG Market, visit [https://sgmarket-api.onrender.com/](https://sgmarket-api.onrender.com/).

## Documentation

For more detailed documentation for the planning process, please refer to the [documentation](/documentation/NDI%20TAP%20Appln.docx).

The server component includes several key components:

### User Component
As there is restricted access to NDI products for actual use, please imagine that the uuid, email should come from the singpass api along with MyInfo authorisation.

The `biometricVerified` will be marked as `true` as new users are required to go through on round of NDI's biometric's facial verification. However, if user has failed, it will add a count into their initial `flag` attribute. It will also automically log a `suspicious activity report` that is `System Generated`.

At any point of time during usage of the system, if the user has any suspicious/inappropriate behaviour, the system will also log a `suspicious activity report`. Users can also make reports. These will add onto the flag for the reported user. When users have accumulated a certain number of flags, we will automatically trigger the biometric verification and submit a report to NDI (not done).
### Model

- **Schema Fields:**
  -  `username`: A unique user identifier
  - `uuid`: A unique user identifier.
  - `email`: User's email address.
  - `biometricVerified`: Indicates whether the user's biometric data is verified.
  - `flags`: Count of suspicious activity flags.
  - `createdAt`: Timestamp of user registration.
  - `updatedAt`: Timestamp of the last update to user data.

### Routes

#### Get User by UUID

- **Route:** `/user/view/uuid/:uuid`
- **Controller:** `getUserByUuid`
- **Required Parameters:** `uuid` (User's unique identifier).

#### Get User by ID

- **Route:** `/user/view/id/:userId`
- **Controller:** `getUserById`
- **Required Parameters:** `userId` (MongoDB user ID).

#### Create User

- **Route:** `/user/onboard`
- **Controller:** `createUser`
- **Required Body Fields:**
  - `username`: A unique user identifier. 
  - `email`: User's email address.
  - `uuid`: A unique user identifier.
- **Optional Body Fields:**
  - `biometricVerified`: Indicates whether the user's biometric data is verified. (Defaults to true on registration -- following the flow)
  - `flags`: Count of suspicious activity flags. (defaults to 0)

#### Update User by UUID

- **Route:** `/user/update/:uuid`
- **Controller:** `updateUserByUuid`
- **Required Parameters:** `uuid` (User's unique identifier).

#### Delete User by UUID

- **Route:** `/user/delete/:uuid`
- **Controller:** `deleteUserByUuid`
- **Required Parameters:** `uuid` (User's unique identifier).

## Chat and Message Component

### Chat Model

- **Schema Fields:**
  - `participants`: An array of user IDs participating in the chat.
  - `listingId`: The ID of the listing associated with the chat.
  - `createdAt`: Timestamp of chat creation.

### Message Model

- **Schema Fields:**
  - `chatId`: The ID of the chat associated with the message.
  - `senderId`: The ID of the message sender.
  - `content`: The message content.
  - `timestamp`: Timestamp of the message.

### Routes

#### Create Message

- **Route:** `/chats/create`
- **Controller:** `createChat`
- **Required Body Fields:**
  - `participants`: An array of user IDs participating in the chat.
  - `listingId`: The ID of the listing associated with the chat.

#### Get Chat by listingId (unique to user-pair and item)

- **Route:** `/chats/view/:listingId`
- **Controller:** `getChatForListing`
- **Required Parameters:** `listingId` (Listing ID), `uuid` (user's, in req query)

#### Get Chats by UUID

- **Route:** `/chats/view/all/:uuid`
- **Controller:** `getChatsForUser`
- **Required Parameters:** `uuid` (user UUID) 
- 

#### Send Message as a buyer

- **Route:** `/messages/buy/:listingId`
- **Controller:** `messageSeller`
- **Required Parameters:** `listingId` (Listing ID).
- **Required Body Fields:**
  - `content`: The message content.
  - `uuid`: The UUID of that a buyer (NOT listing owner) 
-  **Optional Body Fields**
  - `chatId`: The ID of that unique chat


#### Send Message as a seller

- **Route:** `/messages/buy/:listingId`
- **Controller:** `messageBuyer`
- **Required Parameters:** `listingId` (Listing ID).
- **Required Body Fields:**
  - `content`: The message content.
  - `chatId`: The ID of that unique chat (unqiue to item-chat participant pair) [OPTIONAL if `buyerUUID` specified]
  - `buyerUUID`: The UUID of that a unique buyer (not listing owner) [OPTIONAL if `chatId` specified]
-  **Optional Body Fields**
   - `sellerUUID`: The UUID of the message sender.

#### Get Messages by ListingId (Gets message history/log)

- **Route:** `/messages/view/:listingId`
- **Controller:** `getMessagesInChatForListing`
- **Required Parameters:** 
  - `uuid` : can be buyer or seller's UUID (in query)
  - `listingId` (Listing ID)

## Listing Component

### Listing Model

- **Schema Fields:**
  - `seller`: The ID of the user selling the item.
  - `title`: The title of the listing.
  - `description`: The description of the listing.
  - `price`: The price of the item.
  - `status`: The status of the listing (e.g., "available," "reserved," "sold").
  - `createdAt`: Timestamp of listing creation.

### Routes

#### Create Listing

- **Route:** `/listing/create`
- **Controller:** `createListing`
- **Required Body Fields:**
  - `seller`: The ID of the user selling the item.
  - `title`: The title of the listing.
  - `description`: The description of the listing.
  - `price`: The price of the item.

#### Get Listing by ID

- **Route:** `/listing/view/:listingId`
- **Controller:** `getListingById`
- **Required Parameters:** `listingId` (Listing ID).

#### Get All Listings by Seller ID

- **Route:** `/listing/view/seller/:sellerId`
- **Controller:** `getListingsBySellerId`
- **Required Parameters:** `sellerId` (Seller's User ID).

## Reservation Component
On successful reservation (seller approved and buyer paid), we will generate a QR code using NDI's Verify system for the user and upon receiving the item successfully, the buyer will have to scan the QR code to verify that they've received it. 

On top of that, during meet ups, they will have to scan the one on the seller's mobile/device. Upon succcesful verification, we will mark the reservation as `isReceived` = `true` and the respective item to be `status` = `sold`.

Payment will automatically be released to the seller upon this success of this process.

### Reservation Model

- **Schema Fields:**
  - `listingId`: The ID of the listing associated with the reservation.
  - `buyer`: The ID of the user making the reservation.
  - `approvalStatus`: The approval status of the reservation (e.g., "pending," "approved," "rejected").
  - `isMailing`: Indicates whether the item will be mailed.
  - `meetupLocation`: The location for a meetup (required if `isMailing` is false).
  - `paymentStatus`: The payment status of the reservation (e.g., "pending," "completed").
  - `priceOffer`: The price offered for the item.
  - `isReceived`: Indicates whether the item has been received.

### Routes

#### Create Reservation

- **Route:** `/reservation/reserve/:listingId`
- **Controller:** `createReservation`
- **Required Parameters:** `listingId` (Listing ID).
- **Required Body Fields:**
  - `isMailing`: Indicates whether the item will be mailed.
  - `meetupLocation`: The location for a meetup (required if `isMailing` is false).
  - `priceOffer`: The price offered for the item.

#### Update Reservation by ID

- **Route:** `/reservation/update/:reservationId`
- **Controller:** `updateReservationById`
- **Required Parameters:** `reservationId` (Reservation ID).
- **Required Body Fields:**
  - Fields to be updated (e.g., `isMailing`, `meetupLocation`, `priceOffer`).

#### Update Reservation Approval Status

- **Route:** `/reservation/update/approval/:reservationId`
- **Controller:** `updateApprovalStatus`
- **Required Parameters:** `reservationId` (Reservation ID).
- **Required Body Fields:**
  - `approvalStatus` (e.g., "approved").

#### Update Reservation Payment Status

- **Route:** `/reservation/update/payment/:reservationId`
- **Controller:** `updatePaymentStatus`
- **Required Parameters:** `reservationId` (Reservation ID).
- **Required Body Fields:**
  - `paymentStatus` (e.g., "completed").

## SuspiciousActivityLog Component

### SuspiciousActivityLog Model

- **Schema Fields:**
  - `user`: The ID of the user associated with the suspicious activity.
  - `reportedBy`: The entity that reported the suspicious activity.
  - `reason`: A description of the suspicious activity.
  - `reportedOn`: Timestamp of when the suspicious activity was reported.

### Routes

#### Get Suspicious Activity Log by ID

- **Route:** `/report/view/:logId`
- **Controller:** `getSuspiciousActivityLogById`
- **Required Parameters:** `logId` (Log ID).

#### Get All Suspicious Activity Logs by User UUID

- **Route:** `/report/view/all/user/:uuid`
- **Controller:** `getAllSuspiciousActivityLogsByUserId`
- **Required Parameters:** `uuid` (User's unique identifier).

#### Create Suspicious Activity Log

- **Route:** `/report/create/log`
- **Controller:** `createSuspiciousActivityLog`
- **Required Body Fields:**
  - `uuid`: The UUID of the user associated with the suspicious activity.
  - `reason`: A description of the suspicious activity.
- **Query Parameter:**
  - `reportedBy`: The entity reporting the suspicious activity (optional).

#### Delete Suspicious Activity Log by ID

- **Route:** `/report/delete/:logId`
- **Controller:** `deleteSuspiciousActivityLogById`
- **Required Parameters:** `logId` (Log ID).

#### Get Suspicious Activity Logs by Date Range

- **Route:** `/report/view/range/user/:uuid`
- **Controller:** `getSuspiciousActivityLogsByDateRange`
- **Required Parameters:** `uuid` (User's unique identifier).
- **Query Parameters:**
  - `startDate`: The start date of the date range.
  - `endDate`: The end date of the date range.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or inquiries, please contact [Rachel Gina Abelarde](rgabelarde@gmail.com).

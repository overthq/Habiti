# Market TODOs

I'm not creating issues for these TODOs yet, because I'm currently the only developer working on this project. You can also refer to this as a guide to understanding the status of the project.

## App

### General UI/UX improvements

- [ ] Figure out better card tokenization UX.
- [ ] Design a better "store header" component.

### Features

- [ ] Add "Related Products" section to Product screen.
- [ ] Add "Add all items to cart" button to Order screen.
- [ ] Add button that leads directly to store cart to the Store screen.

### Bugs

- [ ] Fix issues with adding products to carts.

### Chores

- [ ] Create a pattern where we have a wrapper for every screen that depends on pre-existing data. The screen should display a generic loading indicator or error boundary if any of its "dependencies" are not correctly loaded and the actual screen is completely typesafe.

## Dashboard

### General UI/UX improvements

- [ ] Merge code for "Add Product" and "Product" screens, for maximum code reuse and simplicity. We will have a conditional `productId` param, so we can add page-specific features by checking this param.

### Features

- [ ] Add general metrics to the overview page.

### Bugs

- [ ] Fix issues with switching stat periods on overview screen.

## API

### Features

- [ ] Figure out statistics, and other dashboard overview details.
- [ ] Set up "collections/groups" for products.

### Bugs

- [ ] Fix registration/authentication issues.

### Data

- [ ] Rethink schema.

Temporary order-related notes (very rough):

Order screen

Order process:

- Once order is accepted, the funds go into escrow, and we should keep track of "potential revenue" for the store
- Potential revenue is the amount of revenue if all pending orders are fulfilled.
- Based on the ratio of potential revenue to actual revenue over time, we can finetune projected revenue over a year/month/quarter in the future.

- Mark as fulfilled
- Cancel order
- Skip processing, stick to this workflow: pending -> fulfilled/cancelled -> out for delivery (if fulfilled).

On order creation, we should have two buttons available:
"Mark as fulfilled" and "Cancel"

On "mark as fulfilled", we should:

- Create an invoice
- Switch the order status to fulfilled
- Notify the user? (no, only notify the user when the item is out for delivery).

On "cancel", we should:

- Ask for a reason.
- Notify the user that the order was cancelled.
- Refund the money (in its entirety) to the user.
- Mark the order as cancelled and remove it from the main orders screen. By default, we should not display fulfilled/cancelled orders.

Delivery process:

- On pickup, mark order as outbound
- Once dispatch confirms delivery (or once we confirm pickup), release funds to the merchant.
- Anything after this has to go through the return/refund process.

Payout process:

- At any point in time, merchants can trigger a payout. However, manual payouts will incur an additional fee?
- Generally, payouts should be done on either a fixed cadence, or users should be able to set a cadence (this will help us save money on individual API calls to providers, if we can just do everything in bulk 50+% of the time).
- We can also create a setting that automatically pays out users a certain percentage of their current revenue at certain amounts, or a certain amount every fixed period (if available, of course).

TLDR: On fulfilled/cancelled, no way back. On pending, allow fulfilled or cancelled. Very simple at first, but we should definitely provide a way to recover orders from the phantom zone. We can also just allow store owners to attach status messages to orders that might need more clarification or something.

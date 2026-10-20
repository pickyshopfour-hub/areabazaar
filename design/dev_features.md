# AREABAZAAR DEV PROJECT FEATURES FOR IMPLEMENTATION

## ADMIN RELATED FEATURES

### AUCTIONS - SESSION PREP RELATED FEATURES
| REF | FEATURE | DESCRIPTION | ADDITIONAL DETAILS | ALREADY DONE |
| :--- | :--- | :--- | :--- | :--- |
| ADM-SP-01 | Create Auction Session | Frontend form | | done |
| ADM-SP-02 | Load Auction Products | Admin can specify the ProductVariants to be included as ShowProducts for each Auction Session. | The initiating button opens a Google Appscript-attached Google sheet, where this feature is implemented : The Google Sheets file contains several sheets , with Product Variants of a product category in each sheet, from among which several items can be selected (with the row cell set for that), and a custom menu link clicked to add all selected items to the “Summing” sheet in the file, - where other parameters to make them into ShowProducts can be set. A side panel form is used to fill in details specific to the Auction Session they are meant for and the submission is saved.<br><br>A link in the custom menu can be used to export the Wave template sheet from the saved Auction Products sheet. This is the template that can be duplicated and the prices of the products changed in the duplicates, to generate several Wave Data sets, later to be used . | |
| ADM-SP-03 | Add Variant(product) button | button in frontend | | done |
| ADM-SP-04 | View + Manage Auction Products | Admin can manage the ShowProducts for each Auction Session : hide, unhide , remove, view details | View Table with action-link: ”edit: done in front end | |
| ADM-SP-05 | SessionPrep-VerifyStock | Displays submissions on product stock by the WHM for the day and can either approve or reject each product for the Auction Session (that is - variants of the base-product concerned) | Initiating button in frontend | already done |
| ADM-SP-06 | SessionPrep-VerifyQA | Displays submissions on product Quality Assurance Checks for the day by the WHM and can either approve or reject each product for the Auction Session (that is - variants of the base-product concerned) | Initiating button in frontend | already done |
| ADM-SP-07 | SessionPrep-VerifyHR | Displays the submission of the WHM for the day on the manpower available and can approve or disapprove the running of the session, as well as state the percentage capacity to run and also if extra demand should be allowed | Initiating button in frontend | already done |
| ADM-SP-08 | SessionPrep-VerifyLogistics | Displays the submission of the WHM on Package, Labels , Transport Equipment and Transport Providers (ZBDp) available for the day and can and can approve or disapprove the running of the session, as well as state the percentage capacity to run and also if extra demand should be allowed | Initiating button in frontend | already done |

### AUCTIONS - PARTNERS RELATED FEATURES
| REF | FEATURE | DESCRIPTION | ADDITIONAL DETAILS | ALREADY DONE |
| :--- | :--- | :--- | :--- | :--- |
| ADM-PT-01 | Approve New SBA | SeniorAdmin Only!! - Can View list of new SBA added and can view details and also can approve, reject, query , flag | Admin can only View List and can view details of each item. Query and flag actions will prompt the SeniorAdmin to add a note and assign to one or more staff-user. | |
| ADM-PT-02 | Approve New ZBDp | SeniorAdmin Only!! - Can View list of new ZBDp added and can view details and also can approve, reject, query , flag | Admin can only View List and can view details of each item. Query and flag actions will prompt the SeniorAdmin to add a note and assign to one or more staff-user. | |
| ADM-PT-03 | Approve New Product | SeniorAdmin Only!! - Can View list of new Products added and can view details and also can approve, reject, query , flag | Admin can only View List and can view details of each item. Query and flag actions will prompt the SeniorAdmin to add a note and assign to one or more staff-user. | |
| ADM-PT-04 | Approve New Variant | SeniorAdmin Only!! - Can View list of new Product Variants added and can view details and also can approve, reject, query , flag | Admin can only View List and can view details of each item. Query and flag actions will prompt the SeniorAdmin to add a note and assign to one or more staff-user. | |
| ADM-PT-05 | Add New SBA | SeniorAdmin and Admin can add new SBA. - this can be done as a single addition or by using a template sheet filled with data for multiple candidates. | The initiating button opens a Google sheet where this feature is implemented, - a s a Google sheet with side panel form. | |
| ADM-PT-06 | Add New ZBDp | SeniorAdmin and Admin can add new SBA. - this can be done as a single addition or by using a template sheet filled with data for multiple candidates. | The initiating button opens a Google sheet where this feature is implemented, - a s a Google sheet with side panel form. | |

### AUCTION - ACTIVE SESSION RELATED FEATURES
| REF | FEATURE | DESCRIPTION | ADDITIONAL DETAILS | ALREADY DONE |
| :--- | :--- | :--- | :--- | :--- |
| ADM-AS-01 | Manage Active Auction Waves | This lists all the Active Auction Sessions and the Waves that have been loaded into them (current, past and undeployed) | Actions can be taken about each wave as well as action taken about the Auction Session itself | |
| ADM-AS-02 | Manage Active Auction Waves : load/replace wave data | **Load**: New data set defining a wave can be added (using a template sheet with data defining the wave - that is the showProducts involved the price changes, the timing of the price waves and other important pre-determined limits, constraints and details that need be specified)<br>**Replace**: The new loaded wave will automatically replace the affected wave data set, but still keep the replaced wave data set, with a “replaced” status and tag. | This can not be done on a currently active Wave. The loaded wave data set will be displayed but await SeniorAdmin approval . | |
| ADM-AS-03 | Manage Active Auction Waves : switch waves | A wave can be selected from the list and switched-on, which will automatically switch-off the previously active wave. This will automatically change the autoswitch time of that wave to the current time when it was switched on. | A Wave data set can only be switched into active, AFTER SeniorAdmin approval. | |
| ADM-AS-04 | Manage Active Auction Waves : set wave autoswitch | Against each wave on the list, an action is added for the scheduled time for autoswitch to be specified, which displays. | | |
| ADM-AS-05 | Manage Active Auction Waves : system-auto-switch | Without the manual switching, the scheduled function simply checks the loaded wave data sets and switches on the one that has already reached or passed its due time and is the closest to the current time . | When the scheduled function runs, it send an alert to the Admin to either over-ride it or leave it to complete, then waits for 2 minutes before effecting the switch if Admin does nothing , but switches immediately if Admin approves the switch. If no wave on the list has time set to it, the default wave to switch on when the Auction is started would be the first on the list. | |
| ADM-AS-06 | Manage Active Auction Waves :change/cancel wave autoswitch | if it has been specified, the autoswitch time for each wave on the list can be changed or canceled. | | |
| ADM-AS-07 | View & manage Auction Sessions | This is listing and management for coming, past and ongoing Auction Session (yet to be set as “archived”) | Actions : manage products (not changeable for past sessions), manage orders (still changeable for past sessions), manage finance (not changeable for past sessions), manage wave history (not changeable for past sessions), manage prep Checks (not changeable for past sessions), manage partners (not changeable for past sessions), Manage all reports | |
| ADM-AS-08 | Start auction Session | | | |
| ADM-AS-09 | Pause Auction Session | | | |
| ADM-AS-10 | End Auction Session | | | |

### AUCTION - INVENTORY RELATED FEATURES
| REF | FEATURE | DESCRIPTION | ADDITIONAL DETAILS | ALREADY DONE |
| :--- | :--- | :--- | :--- | :--- |
| ADM-IV-01 | View & Manage Active Auction Products | This is listing and management for Products included in an ongoing Auction Session | Actions : add stock, remove stock, suspend item, change item price**<br>After the end of an Auction Session, The session should still be accessible to be opened to view its Products and other details , until the session is set as “archived” | |
| ADM-IV-02 | Add New Product | SeniorAdmin and Admin can add new Product. - this can be done as a single addition or by using a template sheet filled with data for multiple candidates. | The initiating button opens a Google sheet where this feature is implemented, - a s a Google sheet with side panel form.<br><br>When adding a new product, it should be possible to specify if it has variants. If no variants, then a single Base Product is created and one Variant is also created . If there are variants, then after the Base Product is created, the Add Variants feature should be initiated.<br><br>When Products are added using a filled template sheet, each of the Products added should have their rows shaded orange , until the Add Variant action is done for them. | |
| ADM-IV-03 | Add New Variant | SeniorAdmin and Admin can add new Product Variants. - this can be done as a single addition or by using a template sheet filled with data for multiple candidates. | The initiating button opens a Google sheet where this feature is implemented, - a s a Google sheet with side panel form.<br><br>If a Variant is added for which a Parent-Product was NOT stated (either as single entry or by filled template sheet), - then a Base product should automatically be created to serve as its parent-product . | |

### AUCTION - REPORTS RELATED FEATURES
| REF | FEATURE | DESCRIPTION | ADDITIONAL DETAILS | ALREADY DONE |
| :--- | :--- | :--- | :--- | :--- |
| ADM-RP-01 | System-Auto-BankSync | The system, following a scheduled periodic operation, - runs a Bank Sync, then reconciles the Bank Reports to confirm Payment Reports still “pending” and by extension the corresponding Payment Requests. Thereafter, any yet to be reconciled Bank Report is checked against the “pending” Payment Requests, which are also set to ‘resolved” , if found. | The action then gets well logged. This action is to be initialized by a time-based Trigger set in the Google workspace , triggering a .GS script which sends a hook to a PHP script to effect the action, then returns a copy of the action log data as JSON, to be saved in the designated Google Sheet. | |
| ADM-RP-02 | Initialize Bank Sync | Admin can request a Bank Sync, that automatically pulls all the email reports from the receiving bank account that has NOT yet been marked as treated, then extracting the necessary details to fill the Bank Report data. | | |
| ADM-RP-03 | Orphan Transactions Manual Track | Orphan Transactions are bank deposit transactions among the bank reports, that an invoice_refIdex can not be found in it to track it, hence they have to be tracked manually and assigned to a wallet and/or a Payment Request and/or a Payment Report | | |
| ADM-RP-04 | View & Manage Unconfirmed Payment Reports | Admin can view Payment Reports that have been waiting for more than a cut-off length of time without confirmation, and also manually manage it | **Resolve**: enter the required details (if available), then confirm the Payment Report as matched and by extension the corresponding Payment Request, - awaiting Senior Admin approval before further action.<br>**Query**: write a note and assign it to someone about it.<br>**Set-Cold**: Which can be done only by SeniorAdmin | |
| ADM-RP-05 | View and manage Bank Reports | Admin can view Bank Reports and take action to | **Reconcile**: mass action, which reconciles all “unreconciled” records and updates the records, then highlights the yet to be reconciled records ;<br>**View Details**: individual row action,- to see the detailed data for the entry ;<br>**Query**: write a note and assign it to someone about it. | |
| ADM-RP-06 | View & Manage Payment Requests | Admin can view Bank Reports and take action to | **View Details**: individual row action,- to see the detailed data for the entry ;<br>**Query**: write a note and assign it to someone about it.<br>**Flag**: apply one of the available types of flags on the entry | |
| ADM-RP-07 | View & Manage Payment Reports | Admin can view Bank Reports and take action to | **Confirm**: manually enter the required details (if available), then confirm the Payment Report as matched and by extension the corresponding Payment Request, - awaiting Senior Admin approval before further action.<br>**View Details**: individual row action,- to see the detailed data for the entry<br>**Query**: write a note and assign it to someone about it.<br>**Flag**: apply one of the available types of flags on the entry | |
| ADM-RP-08 | Initialize Payment Confirmation | Admin can initialize a short-cut action that combines the Bank Sync and Payment Report and Request confirmation in a row, then lists the Confirmed Payments Reports , the unconfirmed Payment Reports and the unreconciled Bank Reports . | | |
| ADM-RP-09 | View & Manage Payment Confirmation** | ONLY SeniorAdmin can view a list of Confirmed Payments, and take actions about them | **Approve**: individual row action,- to apply Senior Admin approval for further action ( which is automatically initiated )<br>**Reject**: individual row action,- which leaves the status unchanged and takes a note that is assigned to someone)<br>**View Details**: individual row action,- to see the detailed data for the entry<br>**Query**: individual row action,- to write a note and assign it to someone about it.<br>**Flag**: individual row action,- to apply one of the available types of flags on the entry | |
| ADM-RP-10 | View & Manage Wallet Payment | Admin can view payments by wallet and be able to approve (single or enmasse), or flag, or query them | | |
| ADM-RP-11 | View & Manage Orders | Admin can view a list of the Orders already paid for and take action to : View details, Set as Urgent, Assign, Query, Flag | | |
| ADM-RP-12 | View & Manage Order Items | Admin can view a list of the Order Items and take action to : View details, Approve (single or mass action), Set as Urgent (also automatically sets as approved), Assign(also automatically sets as approved), Query, Flag | | |
| ADM-RP-13 | View & manage Wallets | | history, query, flag | |
| ADM-RP-14 | Initiate Wallet Surveillance Routine | | | |
| ADM-RP-15 | View Audit Logs** | | | |
| ADM-RP-16 | View & Approve Agent Commission | Admin can view list, view details, query and flag . ONLY SeniorAdmin can do all the above and also approve (which does NOT automatically initiate the fund transfer to the Wallet) | The fund transfer is done later when initiated , then the status can be set to “resolved” | |
| ADM-RP-17 | View & Approve SBA Acquisitions | Admin can view list, view details, query and flag . ONLY SeniorAdmin can do all the above and also approve (which does NOT automatically initiate the fund transfer to the Wallet) | The fund transfer is done later when initiated , then the status can be set to “resolved” | |
| ADM-RP-18 | View & Approve ZBDp Bills | Admin can view list, view details, query and flag . ONLY SeniorAdmin can do all the above and also approve (which does NOT automatically initiate the fund transfer to the Wallet) | The fund transfer is done later when initiated , then the status can be set to “resolved” | |
| ADM-RP-19 | View & Manage WHM Order Progress | Admin can View list and other actions : Ack - Acknowledge the report , Quey, Flag | | |
| ADM-RP-20 | View & Manage ZBD Order Progress | Admin can View list and other actions : Ack - Acknowledge the report , Quey, Flag | | |
| ADM-RP-21 | View & Manage LMD+Delivery Order Progress | Admin can View list and other actions : Ack - Acknowledge the report , Quey, Flag | | |
| ADM-RP-22 | View & Manage Queries | To view and respond to Queries assigned to a User , and the trail of replies that may follow , then the status change to “resolved” when resolved (by the originating user) | | |
| ADM-RP-23 | View & Manage Partner Tickets | To view and respond to Partner Help Tickets assigned to a Staff or Unit , and the trail of replies that may follow , then the status change to “resolved” when resolved (by the originating user) | | |
| ADM-RP-24 | View & Manage Customer Tickets | To view and respond to Customer Help Tickets assigned to a Staff or Unit , and the trail of replies that may follow , then the status change to “resolved” when resolved (by the originating user) | | |

### ESSENTIAL ENTITIES ADMIN RELATED FEATURES
| REF | FEATURE | DESCRIPTION | ADDITIONAL DETAILS | ALREADY DONE |
| :--- | :--- | :--- | :--- | :--- |
| ADM-EE-01 | View + Manage + Add New WHZ | Admin can add and manage Warehouse Zone(s) - WHZ , - which are collections of collocated warehouses, from which products are sourced from SBAs. | The dataset defining each WHZ are submitted (single or multiple) using a filled template Google workspace file.<br>ONLY SeniorAdmin can “approve” newly added entries, “assign-chargeOfficer” and “reassign”, Suspend, Unsuspend.<br>Admin can view list, view details(limited), query, flag | |
| ADM-EE-02 | View + Manage + Add New Staff | Admin can add and manage Staff users. | The dataset defining each Staff are submitted (single or multiple) using a filled template Google workspace file .<br>Only Senior Admin can Add, Remove, Assign Charge, Reassign , Deploy , Redeploy , Suspend, Unsuspend, hide , unhide.<br>Admin can view list, view details(limited), query, flag | |
| ADM-EE-03 | View + Manage + Add New Area/Location | Admin can add and manage Operations Coverage Region (Area). | The dataset defining each Area are submitted using a filled template Google workspace file .<br>Only Senior Admin can Add, Remove, Assign Charge, Reassign , Deploy , Redeploy , Suspend, Unsuspend, hide , unhide.<br>Admin can view list, view details(limited), query, flag | |
| ADM-EE-04 | View + Manage + Add New Route | Admin can add and manage Route Definition dataset, to be followed for ZBD dispatch and Last Mile Delivery (LMD) missions. | The dataset defining each Routes are submitted using a filled template Google workspace file .<br>ONLY SeniorAdmin can “approve” newly added entries, “assign-chargeOfficer” and “reassign”, Suspend, Unsuspend, hide , unhide.<br>Admin can view list, view details(limited), query, flag | |
| ADM-EE-05 | View + Manage + Add New Bank | | Only Senior Admin can Add, Remove, Assign Charge, Reassign , Deploy , Redeploy , Suspend, Unsuspend, hide , unhide.<br>Admin can view list, view details(limited), query, flag | |
| ADM-EE-06 | View + Manage + Add New GoogleAcct | | Only Senior Admin can Add, Remove, Assign Charge, Reassign , Deploy , Redeploy , Suspend, Unsuspend , hide , unhide.<br>Admin can view list, view details(limited), query, flag | |


## CUSTOMER

### BASIC ACCOUNT AND AUTHENTICATION
| REF | FEATURE | DESCRIPTION | ADDITIONAL DETAILS | ALREADY DONE |
| :--- | :--- | :--- | :--- | :--- |
| CUS-AU-01 | Create Account | | | |
| CUS-AU-02 | Login | | | |

### AUCTION SHOPPING AND CHECKOUT RELATED FEATURES
| REF | FEATURE | DESCRIPTION | ADDITIONAL DETAILS | ALREADY DONE |
| :--- | :--- | :--- | :--- | :--- |
| CUS-AS-01 | Display ShowProduct groups (by product or category) | When the Auction Page loads, the Show Products selected for the Auction Session are fetched and each group of products gets iterated through to display the products in the group, in the section for each of their own groups | | |
| CUS-AS-02 | Display Product Details | The Details a a product get displayed in a modal, when the product card is clicked anywhere other than the Bid Now button | The Route, Controller and Models to support this remains yet to be implemented | Already implemented in the frontend |
| CUS-AS-03 | Change Item Quantity | Next to the element to specify the Quantity, an element to display the value of the Quantity set should be included, auto-calculating as the quantity is changed | | Already implemented structurally in the frontend |
| CUS-AS-04 | Bid Now | | | Already implemented in the frontend |
| CUS-AS-05 | Spot Order | | | Already implemented in the frontend |
| CUS-AS-06 | Add to Cart | | | Already implemented in the frontend |
| CUS-AS-07 | View Active Cart | | | Already implemented in the frontend |
| CUS-AS-08 | View Order History | | | |
| CUS-AS-09 | Remove cart item | | | |
| CUS-AS-10 | Checkout Cart => Pay by Wallet => Auth WalletPay | | | Already implemented in the frontend |
| CUS-AS-11 | Get Delivery PassCode | | | |

### WALLET RELATED FEATURES
| REF | FEATURE | DESCRIPTION | ADDITIONAL DETAILS | ALREADY DONE |
| :--- | :--- | :--- | :--- | :--- |
| CUS-WL-01 | View Wallet | | | Already implemented in the frontend |
| CUS-WL-02 | Deposit Fund | | | |
| CUS-WL-03 | Payment Request | | | |
| CUS-WL-04 | Report Payment | | | |
| CUS-WL-05 | View Transactions | | | |
| CUS-WL-06 | Acknowledge Deposit Success | | | |
| CUS-WL-07 | Query Transaction | | | |

### NON-AUCTION SHOPPING FEATURES
| REF | FEATURE | DESCRIPTION | ADDITIONAL DETAILS | ALREADY DONE |
| :--- | :--- | :--- | :--- | :--- |
| CUS-NA-01 | Search Product List | Customers can search through the product list and right from the search results make a purchase by either Spot Order or Add to Cart and Checkout | | |
| CUS-NA-02 | Submit Purchase List | Customer can submit a list of items they wish to purchase(either by typing them in or by uploading a list, which) | | |
| CUS-NA-03 | View Purchase Invoice | Customers can view the Invoice generated from their submitted Purchase Lists. | Much like the manner of a cart, they can adjust the quantities of items, cancel items, cancel the whole invoice | |
| CUS-NA-04 | Checkout Purchase Invoice => order is created ... | Customers can ultimately pay by their Wallets for what the final total is on an Invoice sent for a submitted Purchase List, resulting in an order and treated as such after that point. | | |


## WHM RELATED FEATURES

### AUCTIONS - SESSION PREP FEATURES
| REF | FEATURE | DESCRIPTION | ADDITIONAL DETAILS | ALREADY DONE |
| :--- | :--- | :--- | :--- | :--- |
| WHM-SP-01 | Add New SBA | | | |
| WHM-SP-02 | Add New ZBDp | | | |
| WHM-SP-03 | Add New Product | | | |
| WHM-SP-04 | Update Products (Base Products) | | | |
| WHM-SP-05 | Add New Variant | | | |
| WHM-SP-06 | View + Manage Auction Products | | | |
| WHM-SP-07 | SessionPrep-CheckStock | | | |
| WHM-SP-08 | SessionPrep-CheckQA | | | |
| WHM-SP-09 | SessionPrep-CheckHR | | | |
| WHM-SP-10 | SessionPrep-CheckLogistics | | | |

### AUCTION - ACTIVE SESSION FEATURES
| REF | FEATURE | DESCRIPTION | ADDITIONAL DETAILS | ALREADY DONE |
| :--- | :--- | :--- | :--- | :--- |
| WHM-AS-01 | View WHM Work Metrics | | | |
| WHM-AS-02 | View & Manage WHM Order Progress | | | |
| WHM-AS-03 | Initiate Retrieve OrdersWHM | | | |
| WHM-AS-04 | System Auto-retrieve OrdersWHM | | | |
| WHM-AS-05 | Initiate Orders Resolution | | | |
| WHM-AS-06 | View and Manage Order Items | | | |
| WHM-AS-07 | View and Manage Resolved Order Products | | | |
| WHM-AS-08 | Initiate Bill Calculations | | | |
| WHM-AS-09 | Compile + Assign + Post Bill Calculations | | | |
| WHM-AS-10 | View & Mange SBA Acquisitions | | {ack, } | |
| WHM-AS-11 | View & Manage ZBDp Bills | | {ack, } | |
| WHM-AS-12 | Add & View Expenses | | {queryAdm, } | |

## SBA RELATED FEATURES
| REF | FEATURE | DESCRIPTION | ADDITIONAL DETAILS | ALREADY DONE |
| :--- | :--- | :--- | :--- | :--- |
| SBA-FT-01 | View SBA Metrics | | | |
| SBA-FT-02 | View & ConfirmSupply - Batch | | | |
| SBA-FT-03 | View Financial Accounts | | | |
| SBA-FT-04 | Query Financial Account Entry | | | |
| SBA-FT-05 | Add New Product | | | |
| SBA-FT-06 | View & Manage Product Inventory | | | |

## AGENT RELATED FEATURES

### MY ACCOUNT (Agent’s own Account matters)
| REF | FEATURE | DESCRIPTION | ADDITIONAL DETAILS | ALREADY DONE |
| :--- | :--- | :--- | :--- | :--- |
| AGT-MA-01 | View my Profile | | | |
| AGT-MA-02 | View My Wallet | | | |
| AGT-MA-03 | Deposit Fund | | | |
| AGT-MA-04 | Payment Request | | | |
| AGT-MA-05 | Report Payment | | | |
| AGT-MA-06 | View Transactions | | | |
| AGT-MA-07 | Acknowledge Deposit Success | | | |
| AGT-MA-08 | Query Transaction | | | |
| AGT-MA-09 | View and Manage My Orders | | | |
| AGT-MA-10 | View & Manage My Commissions Accounts | | | |
| AGT-MA-11 | View & manage Help tickets | | | |

### CUSTOMER SERVICE (features relating to service to the customers)
| REF | FEATURE | DESCRIPTION | ADDITIONAL DETAILS | ALREADY DONE |
| :--- | :--- | :--- | :--- | :--- |
| AGT-CS-01 | View My Customers Payment Request | Agents can view the Payment Request for customers that they facilitated payment for, but given access to limited details . | | |
| AGT-CS-02 | Report Customers Payment | Agents can report payments facilitated for customers, AFTER making the back transfer/payment. | The action is initiated by first entering the invoice_refIdex provided by the Customer(which was obtained when the Payment was requested. | |
| AGT-CS-03 | View My Customers Transactions | Agent can view and manage the payments they facilitated for a customer | Actions : view details, Ack (Acknowledge success), Query, Flag | |
| AGT-CS-04 | Submit Customer’s Order | Agents can submit an order for a customer and choose to pay from their Partners Wallet or choose that the customer pays with their wallet(in which case a link to visit to make the payment is sent to the customer | | |
| AGT-CS-05 | View and Manage My Customers Orders | | | |
| AGT-CS-06 | View & Manage My Customers | Agents can view and take a few actions about customers registered with their Ref-code. | Actions : view details (limited), query, direct message, flag | |
| AGT-CS-07 | View and Manage My Charge Orders | Agent can view and manage Orders they placed on customers behalf | Actions : view details, query, request help, cancel (locked 1 hour after confirmation) | |
| AGT-CS-08 | View & Manage My Charge Deliveries | | Actions : view details, receive package, initiate delivery, complete delivery, query, request help | |

## ZBDp RELATED FEATURES
| REF | FEATURE | DESCRIPTION | ADDITIONAL DETAILS | ALREADY DONE |
| :--- | :--- | :--- | :--- | :--- |
| ZBD-FT-01 | View ZBD Work Metrics | | | |
| ZBD-FT-02 | View & Ack Assignments | | | |
| ZBD-FT-03 | Update Batch ZBD Progress | | | |

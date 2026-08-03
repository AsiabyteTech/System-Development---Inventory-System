# Inventory Management System - Frontend 

## Project Structure

```
frontend/
├── node_modules/
├── public/ (images/, icons/)
│   ├── Pictures/
│   └── vite.svg
├── src/
│   ├── api/            
│   │   └── api.js    
│   │   └── customer.js
│   │   └── orders.js
│   │   └── products.js
│   │   └── stock.js
│   │   └── suppliers.js
│   │   └── invoices.js
│   │   └── inventory.js
│   │   └── promo.js
│   │   └── package.js
│   │   └── dashboard.js
│   │   └── reports.js
│   ├── assets/         (react.svg) # Images, fonts, styles
│   ├── components/                 # Reusable components (Common, UI, Layout)
│   │   ├── common/                 # Common components
│   │   └── forms/
│   │   └── Sidebar.jsx
│   │   └── FilePreviewModal.jsx
│   ├── contexts/                   # Context API
│   │   └── AuthContext.jsx
│   ├── hooks/                      # Custom React hooks
│   │   └── useInvoices.js          # Invoice CRUD + scan + file upload
│   │   └── useOrders.js            # Order/Customer CRUD + file upload
│   │   └── useProducts.js          # Product CRUD + scan + file upload
│   │   └── useStock.js
│   │   └── useSuppliers.js         # Supplier CRUD + image upload
│   ├── services/                   # API calls & services (api.js)
│   ├── shared/                     # Page Restriction Authority
│   │   └── role.jsx
│   ├── styles/         (animations.css, buttons.css, forms.css, modals.css, print.css)
│   │   └── animations.css
│   ├── utils/          (errorHandler.js) # Reusable helper function
│   ├── pages/                      # Application Pages
│   │   └── Login.jsx
│   │   └── Register.jsx            # Register staff (admin-only)
│   │   └── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   │   └── UserProfile.jsx
│   │   └── Home.jsx
│   │   └── Dashboard.jsx           # Dashboard metrics 
│   │   └── ReportOrder.jsx         # P&L reports
│   │   └── ReportProductValue.jsx
│   │   └── AddEditPromo.jsx        # Promo CRUD
│   │   └── AddEditPackage.jsx      # Package CRUD
│   │   └── Supplier.jsx            # Supplier CRUD + image upload
│   │   └── AddEditSupplier.jsx
│   │   └── Invoice.jsx             # Invoice CRUD + scan + file upload
│   │   └── AddEditInvoice.jsx
│   │   └── Product.jsx             # Product CRUD + scan + file upload
│   │   └── AddEditProduct.jsx
│   │   └── Stock.jsx               
│   │   └── AddEditStock.jsx
│   │   └── Order.jsx               # Order/Customer CRUD + file upload
│   │   └── Customer.jsx
│   │   └── Inventory.jsx
│   ├── App.jsx 
│   ├── App.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json / package-lock.json
└── .gitignore
```


---

## Tech Stack

| Software Component | Tool/Software Name | Version | Purpose |
|--------------------|--------------------|---------|---------|
| DBMS | MySQL | 8.40 | Database storage and management |
| Server Platform |  |  |  |
| Cloud Network Computing | Amazon Web Server (AWS) |  |  |
| Operating System | Windows OS | 10 | Provides the foundational platform for hosting the development and production environments. |
| Design & Modeling | Draw.io |  | Used to create all system design diagrams, including Entity-Relationship Diagrams (ERD), Data Flow Diagrams (DFD), and Architecture Diagrams |
| Integrated Development Environment (IDE) | Visual Studio Code |  | The primary code editor used for writing, debugging, and testing the application's source code. Offers extensions for Python, HTML, CSS, and ReactJS. |
| Server-side Scripting |  |  |  |
| Frontend | React.js, CSS3, HTML5 |  | Standard web technologies used to build the structure, style, and interactivity of the user interface in the client's browser.  |
| Backend | Python (Django) |  |  |
| Communication API | RESTFUL API |  |  |


---

## Problem Statement

AsiaByte Technologies currently experiences operational inefficiencies in its inventory management and order fulfillment processes. These challenges include:

1.	**Inefficient inventory and order planning:** <br>

Manual insertion of product and order details in Excel leads to many information sheets, non-reporting values, and typo-keyed-in details. 

2.	**Stock Mismatch Issues:** <br>

Discrepancies between the personal chat product needs from the customer and the actual product inventory can lead to order cancellations, delivery delays, and negative seller ratings. 

3.	**Non-Priority in Invoice/Supplier Management:** <br>

The absence of a systematic approach for invoice tracking in the stock keeping unit, total product value, and total margin limits the company's ability to optimize procurement costs and ensure reliable supply chains.  


---

## Objectives

To develop and implement a comprehensive Asiabyte P&L Inventory System that streamlines AsiaByte's inventory control, order fulfillment, and supplier management processes, thereby reducing operational costs and enhancing user satisfaction.

1.	**Improve Inventory Planning** <br>

•	Implement Barcode Scanning for quick product intake using Manufacturer Series scanning <br>

•	Develop reporting capabilities for inventory turnover analysis. <br>

•	Establish optimal buffer stock levels for fast-moving and high-value products <br>


2.	**Real-Time Stock Tracking and Order Planning** <br>

•	Implement real-time stock level monitoring across all SKUs <br>

•	Establish automatic synchronization between physical inventory and order/sales platforms <br>

•	Create low-stock alerts and reordering triggers based on predefined thresholds <br>


3.	**Enhance Invoice/Supplier Management** <br>

•	Create a supplier invoice tracking system with key metrics (stock keeping unit, total product value, and total margin) <br>

•	Establish a centralized database for supplier information and product value comparisons <br>

•	Enable data-driven decision making for cost product value in inventory negotiation. <br>


---

## Scope of the Project

### User Scope

| User Role | Capabilities | Modules Related |
|-----------|--------------|-----------------|
| **Administrator** | Can view details of Invoice, Supplier, Product, Stock, Order, Customer <br> Can upload details of Invoice, Supplier, Product, Stock, Order, Customer <br> Can update details of Invoice, Supplier, Product, Stock, Order, Customer <br> Can generate reports from the dashboard regarding order and stock management <br> Can know the order status based on the order tracking record per customer. <br> | Module 1: Dashboard <br> Module 2: Supplier Loading Section <br> Module 3: Product / Stock Distribution <br> Module 4: Order Management <br> |
| **General Staff** | Can view details of Invoice, Supplier, Product, Stock, Order, Customer <br> Can generate reports from the dashboard regarding order and stock management <br> Can know the order status based on the order tracking record per customer. <br> | Module 1: Dashboard <br> Module 2: Supplier Loading Section <br> Module 3: Product / Stock Distribution <br> Module 4: Order Management <br> |


### Module Scope


#### Module 1: Dashboard

a)	**Purpose:** To provide a comprehensive, real-time overview of AsiaByte's entire inventory and sales operations, enabling quick decision-making and proactive management through centralized data visualization and key performance indicators. 

b)	**Features:** 

```

i.	Card: Total Order, Low Product Items, Total Inventory Value, Total Product

ii.	Bar Chart: Order Volume (x = Product, y = Total Order), filter by Sales Platform, Month, and Year.

iii.Order Volume Report per month/year: Overall Product Details, Services, List of Orders, Total Order 

iv.	Line Chart: Total Inventory Value (x = Product, y = Payment Price), filter by Product, Month, and Year.

v.	Total Inventory Value Report per month/year: Overall Product Details, Services, List of Stock, Total Inventory Value (further discussion)

vi.	Traffic Light Table: Low Product Items (Attributes = Product, Stock Level, Status (Good, Low, Out, Initial Stock)), filter by Status, Product

vii. Table: Season Packages (Attributes: Ticket Package, Package Name, Product, Quantity, Price, Dateline) Season Promotion (Attributes: Promo Name, Product, Reduction, Price, Dateline)

viii. Add Edit Promotion: The concept design of the add and edit promotion page for each product for a reduced price per season. It accepts user input, including Promotion Name, Remark, Dateline, Reduction, and Price. 

ix.	Add Edit Package: The concept design of the add and edit package page to group product stock under one unit. It accepts user input such as Package Name, Price, Dateline, and Remark. 

```

c)	**Not Included (Out of scope):** Exclude Sales for future development…


#### Module 2: Supplier Loading Section


a)	**Purpose:** To streamline and optimize the supplier management and goods receiving process, ensuring accurate stock updates, cost tracking, and supplier performance monitoring.

b)	**Features:** 

```

i.	Supplier Management: 
•	Comprehensive supplier profile (Add/Edit)
•	Contract & Agreement Tracking: Pricing agreements, terms and conditions
•	The concept design of the add and edit supplier page to record all of the company's clients and partners. It accepts user input such as Supplier Name, Supplier Address, Person In Charge, Supplier Phone Number, and Supplier Image Upload. 

ii.	Invoice Management: 
•	Table of Invoice details and document the product purchase 
•	Barcode Scanning: Quick product intake using Serial Number scanning
•	The concept design of the add and edit invoice page to save the invoice record in the system. It accepts user input such as Reference No, Supplier Name, Remark, Invoice Date, Amount, and File Invoice. Also, a table of attributes, such as Purchase Cost, Additional Cost, and Total Cost to record overall cost, while another table has a serial number to register all stock into the company system.

```

c)	**Not Included (Out of scope):** Exclude Purchase Order Matching: Auto-match received goods with purchase orders via invoice document (AI), also Supplier performance metrics and Sales for future development


#### Module 3: Product / Stock Distribution


a)	**Purpose:** To maintain accurate product information, manage stock levels, and optimize inventory distribution based on demand patterns and sales performance.


b)	**Features:** 

```

i.	Product Management:
•	Comprehensive product profile (Add/Edit)
•	Centralized Product Catalog: Each product has summarized details and stock registered
•	Categorization Filter: Product grouping by SKU, name, type
•	The concept design of the add and edit product page to register under the company’s product. It accepts user input such as Stock Keeping Unit (SKU), Status, Product Image Upload, Quantity On Hand (Balance), Reserved Quantity (Sold), Margin, Product Name, Product Type, Product Details, Initial Vendor Price, and Initial Selling Price to record overall details of each product under the company. 
•	Real-time each product/stock table/tab notifies updates - Stock In, Reserved, Sold (ex: CAM-001 2 - S00001, S00002 Stock-in)
SKU, Total, Serial Number, Status

ii.	Stock Management:
•	Table stock details, customer product reservation, and allocation process status for each stock updates - Stock In, Available, Reserved, Sold (Product/Stock Movement Log)
Stock In, invoice page update
Available, 1 hour after invoice update
Reserved, order created
Sold, order updates 
•	The concept design of the stock page (Display) to check the status of product stock in the company (Available/Reserved/Sold). Stock Keeping Unit (SKU), Stock In/Out, Remark, Serial Number, Reference No, Promo, and Package act as display product/invoice/promo/package related to the stock action and placement. The Tracking Number serves as a display showing the reservation made to the customer.
•	Real-time Stock Level Tracking: Current quantities, reserved stock, available stock

```

c)	**Not Included (Out of scope):** Exclude Sales and Product/Stock specific details allocation for future development…


#### Module 4: Order Management


a)	**Purpose:** To efficiently process real-time customer orders and inventory

b)	**Features:** 

```

i.	Order Management
•	Order Processing Status Workflow: Pending → Delivery → Complete, Cancel and Return 
•	The concept design of the order page to create a table summary order for the customer to check the status of order processing.
•	Categorization Searching Filter: Tracking Number, Customer Name, Status
•	Customer Purchase History

ii.	Customer
•	The concept design of the add and edit customer page to create a single order record in the system. It accepts user input such as Customer Name, Phone Number, Email, Address, Status, Sales Platform, Purchase Date / Stock Out, Tracking Number, Remark, and Total to record all details of customers and their orders. Also, a table of attributes such as SKU, Type, Quantity, and Total to display record order and prices.
•	Order status update: Pending → Delivery → Complete, Cancel and Return 
Pending: Order created
It then updates the order page with order details and the product/stock page with the reserved notify tab and table history.

Cancel and Return (Release): Set status order to cancel 
It then updates the order status on the order page and the stock page with the available status in the table 

Delivery: Update order status on the customer page 
It then updates the order status on the order page 

Complete: Update order status on the customer page 
It then updates the order status on the order page and the product/stock page with the complete/sold notify tab and table history.
 
iii.	Inventory
•	Customer-personalized order platform with an e-commerce concept with real-time updates of stock count available in inventory.
•	Searching Filter: Product Name, SKU
•	Package and Promotion section

iv.	Returns & Refunds Handling (Customer page)
•	Return Authorization: Return request processing and approval
•	Refund Processing: Integration with payment systems for refunds

```

c)	**Not Included (Out of scope):** Order status automation updates


---

## User Interaction with the System

| Interfaces | Module | Administrator | General Staff |
|------------|--------|---------------|---------------|
| Login |  | ✅ | ✅ |
| Register |  | ✅ | ❌|
| Home |  | ✅ | ✅ |
| Dashboard | Module 1: Dashboard | ✅ | ✅ |
| Order Volume Report | Module 1: Dashboard | ✅ | ✅ |
| Total Inventory Report | Module 1: Dashboard | ✅ | ✅ |
| Add Edit Promo | Module 1: Dashboard | ✅ | ❌|
| Add Edit Package | Module 1: Dashboard | ✅ | ❌|
| Invoice | Module 2: Supplier Loading Section | ✅ | ✅ |
| AddEditInvoice | Module 2: Supplier Loading Section | ✅ | ❌|
| Supplier | Module 2: Supplier Loading Section | ✅ | ✅ |
| AddEditSupplier | Module 2: Supplier Loading Section | ✅ | ❌|
| Product | Module 3: Product/Stock Distribution | ✅ | ✅ |
| AddEditProduct | Module 3: Product/Stock Distribution | ✅ | ❌|
| Stock | Module 3: Product/Stock Distribution | ✅ | ✅ |
| AddEditStock | Module 3: Product/Stock Distribution | ✅ | ❌|
| Order | Module 4: Order Management | ✅ | ✅ |
| Customer | Module 4: Order Management | ✅ | ✅ |
| Inventory | Module 4: Order Management | ✅ | ✅ |

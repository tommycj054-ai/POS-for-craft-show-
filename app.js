/* =====================================================
   CROCHET POS — PHASE 7
===================================================== */


/* =====================================================
   DATA
===================================================== */

let products =
    JSON.parse(
        localStorage.getItem("crochetProducts")
    ) || [];

let sales =
    JSON.parse(
        localStorage.getItem("crochetSales")
    ) || [];

let events =
    JSON.parse(
        localStorage.getItem("crochetEvents")
    ) || [];

let activeEventId =
    localStorage.getItem(
        "crochetActiveEvent"
    ) || "";

let cart = [];

let selectedBarcodes =
    new Set();

let editingProductId =
    null;

let scannedStockProductId =
    null;


/* =====================================================
   LABEL SETTINGS
===================================================== */

let labelSettings =
    JSON.parse(
        localStorage.getItem(
            "crochetLabelSettings"
        )
    ) || {

        size: "medium",

        width: 2,

        height: 1.25

    };


/* =====================================================
   SAVE
===================================================== */

function saveData() {

    localStorage.setItem(
        "crochetProducts",
        JSON.stringify(products)
    );

    localStorage.setItem(
        "crochetSales",
        JSON.stringify(sales)
    );

    localStorage.setItem(
        "crochetEvents",
        JSON.stringify(events)
    );

    localStorage.setItem(
        "crochetActiveEvent",
        activeEventId || ""
    );

    localStorage.setItem(
        "crochetLabelSettings",
        JSON.stringify(labelSettings)
    );
}


/* =====================================================
   NAVIGATION
===================================================== */

document
    .querySelectorAll(".nav-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                showPage(
                    button.dataset.page
                );

            }
        );

    });


function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page =>
            page.classList.remove(
                "active"
            )
        );


    const page =
        document.getElementById(
            pageId
        );


    if (page)
        page.classList.add(
            "active"
        );


    document
        .querySelectorAll(".nav-btn")
        .forEach(button => {

            button.classList.toggle(
                "active",

                button.dataset.page ===
                pageId
            );

        });


    if (pageId === "dashboard")
        updateDashboard();


    if (pageId === "inventory")
        displayInventory();


    if (pageId === "barcodes")
        displayBarcodes();


    if (pageId === "checkout") {

        displayCheckoutProducts();

        displayCart();

        focusCheckoutScanner();

    }


    if (pageId === "stockScanner")
        focusStockScanner();


    if (pageId === "events")
        displayEvents();


    if (pageId === "sales")
        displaySales();

}


/* =====================================================
   PRODUCT MODAL
===================================================== */

const productModal =
    document.getElementById(
        "productModal"
    );


document
    .getElementById(
        "openAddProduct"
    )
    .addEventListener(
        "click",
        openAddProduct
    );


function openAddProduct() {

    editingProductId = null;


    document
        .getElementById(
            "productModalTitle"
        )
        .textContent =
        "Add Product";


    [
        "productName",
        "productCategory",
        "productPrice",
        "productStock",
        "productSKU",
        "bundleQuantity",
        "bundlePrice"
    ]
    .forEach(id => {

        document
            .getElementById(id)
            .value = "";

    });


    document
        .getElementById(
            "productLowStock"
        )
        .value = 2;


    productModal.classList.add(
        "show"
    );

}


function closeProductModal() {

    productModal.classList.remove(
        "show"
    );

}


document
    .getElementById(
        "closeProductModal"
    )
    .addEventListener(
        "click",
        closeProductModal
    );


document
    .getElementById(
        "cancelProduct"
    )
    .addEventListener(
        "click",
        closeProductModal
    );


/* =====================================================
   SKU
===================================================== */

function generateSKU() {

    let sku;

    do {

        sku =
            "CR-" +
            Math.floor(
                100000 +
                Math.random() * 900000
            );

    } while (
        products.some(
            product =>
                product.sku === sku
        )
    );

    return sku;

}


/* =====================================================
   SAVE PRODUCT
===================================================== */

document
    .getElementById(
        "saveProduct"
    )
    .addEventListener(
        "click",
        saveProduct
    );


function saveProduct() {

    const name =
        document
            .getElementById(
                "productName"
            )
            .value
            .trim();


    const category =
        document
            .getElementById(
                "productCategory"
            )
            .value
            .trim();


    const price =
        Number(
            document
                .getElementById(
                    "productPrice"
                )
                .value
        );


    const stock =
        Number(
            document
                .getElementById(
                    "productStock"
                )
                .value
        );


    const lowStock =
        Number(
            document
                .getElementById(
                    "productLowStock"
                )
                .value
        );


    let sku =
        document
            .getElementById(
                "productSKU"
            )
            .value
            .trim();


    const bundleQuantity =
        Number(
            document
                .getElementById(
                    "bundleQuantity"
                )
                .value
        );


    const bundlePrice =
        Number(
            document
                .getElementById(
                    "bundlePrice"
                )
                .value
        );


    if (!name) {

        alert(
            "Please enter a product name."
        );

        return;

    }


    if (
        !Number.isFinite(price) ||
        price < 0
    ) {

        alert(
            "Please enter a valid price."
        );

        return;

    }


    if (
        !Number.isFinite(stock) ||
        stock < 0
    ) {

        alert(
            "Please enter valid stock."
        );

        return;

    }


    if (!sku)
        sku = generateSKU();


    if (
        products.some(
            p =>
                p.sku === sku &&
                p.id !== editingProductId
        )
    ) {

        alert(
            "That SKU/barcode is already being used."
        );

        return;

    }


    let bundle = null;


    if (
        Number.isFinite(
            bundleQuantity
        ) &&
        bundleQuantity >= 2 &&
        Number.isFinite(
            bundlePrice
        ) &&
        bundlePrice >= 0
    ) {

        bundle = {

            quantity:
                bundleQuantity,

            price:
                bundlePrice

        };

    }


    if (editingProductId) {

        const product =
            products.find(
                p =>
                    p.id ===
                    editingProductId
            );


        if (product) {

            product.name =
                name;

            product.category =
                category;

            product.price =
                price;

            product.stock =
                stock;

            product.lowStock =
                lowStock;

            product.sku =
                sku;

            product.bundle =
                bundle;

        }

    } else {

        products.push({

            id:
                Date.now(),

            name,

            category,

            price,

            stock,

            lowStock,

            sku,

            bundle

        });

    }


    saveData();

    closeProductModal();

    refreshEverything();

}


/* =====================================================
   EDIT PRODUCT
===================================================== */

function editProduct(id) {

    const product =
        products.find(
            p =>
                p.id === id
        );


    if (!product)
        return;


    editingProductId =
        id;


    document
        .getElementById(
            "productModalTitle"
        )
        .textContent =
        "Edit Product";


    document
        .getElementById(
            "productName"
        )
        .value =
        product.name;


    document
        .getElementById(
            "productCategory"
        )
        .value =
        product.category || "";


    document
        .getElementById(
            "productPrice"
        )
        .value =
        product.price;


    document
        .getElementById(
            "productStock"
        )
        .value =
        product.stock;


    document
        .getElementById(
            "productLowStock"
        )
        .value =
        product.lowStock ?? 2;


    document
        .getElementById(
            "productSKU"
        )
        .value =
        product.sku;


    document
        .getElementById(
            "bundleQuantity"
        )
        .value =
        product.bundle?.quantity || "";


    document
        .getElementById(
            "bundlePrice"
        )
        .value =
        product.bundle?.price || "";


    productModal.classList.add(
        "show"
    );

}


/* =====================================================
   CLEAR BUNDLE
===================================================== */

document
    .getElementById(
        "clearBundle"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "bundleQuantity"
                )
                .value = "";

            document
                .getElementById(
                    "bundlePrice"
                )
                .value = "";

        }
    );


/* =====================================================
   DELETE PRODUCT
===================================================== */

function deleteProduct(id) {

    const product =
        products.find(
            p =>
                p.id === id
        );


    if (!product)
        return;


    if (
        !confirm(
            `Delete "${product.name}"?`
        )
    )
        return;


    products =
        products.filter(
            p =>
                p.id !== id
        );


    selectedBarcodes.delete(
        id
    );


    cart =
        cart.filter(
            item =>
                item.productId !== id
        );


    saveData();

    refreshEverything();

}


/* =====================================================
   INVENTORY
===================================================== */

document
    .getElementById(
        "inventorySearch"
    )
    .addEventListener(
        "input",
        displayInventory
    );


function displayInventory() {

    const list =
        document.getElementById(
            "inventoryList"
        );


    const search =
        document
            .getElementById(
                "inventorySearch"
            )
            .value
            .toLowerCase();


    const filtered =
        products.filter(
            product =>

                product.name
                    .toLowerCase()
                    .includes(search)

                ||

                String(product.sku)
                    .toLowerCase()
                    .includes(search)

                ||

                (
                    product.category ||
                    ""
                )
                    .toLowerCase()
                    .includes(search)

        );


    if (!filtered.length) {

        list.innerHTML = `
            <div class="panel">
                <p>No products found.</p>
            </div>
        `;

        return;

    }


    list.innerHTML =
        filtered
            .map(
                product => {

                    const low =
                        product.stock <=
                        product.lowStock;

                    const out =
                        product.stock <= 0;


                    return `

                        <div class="
                            inventory-card
                            ${low ? "low-stock" : ""}
                        ">

                            <h3>
                                ${escapeHTML(
                                    product.name
                                )}
                            </h3>

                            <div class="sku">
                                SKU:
                                ${escapeHTML(
                                    product.sku
                                )}
                            </div>

                            <p>
                                ${
                                    product.category
                                    ? escapeHTML(
                                        product.category
                                      )
                                    : "No category"
                                }
                            </p>

                            <strong>
                                $${Number(
                                    product.price
                                ).toFixed(2)}
                            </strong>

                            ${
                                product.bundle
                                ?

                                `<div class="bundle-badge">
                                    🧺
                                    ${product.bundle.quantity}
                                    for
                                    $${Number(
                                        product.bundle.price
                                    ).toFixed(2)}
                                </div>`

                                :
                                ""
                            }

                            <div class="stock-number">
                                ${product.stock}
                            </div>

                            <div class="stock-warning">

                                ${
                                    out
                                    ? "🔴 Out of Stock"

                                    : low
                                    ? "🟡 Low Stock"

                                    : "🟢 In Stock"
                                }

                            </div>

                            <div class="modal-buttons">

                                <button
                                    class="secondary-btn"
                                    onclick="
                                        editProduct(
                                            ${product.id}
                                        )
                                    "
                                >
                                    ✏️ Edit
                                </button>

                                <button
                                    class="secondary-btn"
                                    onclick="
                                        deleteProduct(
                                            ${product.id}
                                        )
                                    "
                                >
                                    🗑️ Delete
                                </button>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =====================================================
   BARCODE SETTINGS
===================================================== */

document
    .getElementById(
        "labelSize"
    )
    .addEventListener(
        "change",
        changeLabelSize
    );


document
    .getElementById(
        "applyCustomSize"
    )
    .addEventListener(
        "click",
        applyCustomSize
    );


function changeLabelSize() {

    const size =
        document
            .getElementById(
                "labelSize"
            )
            .value;


    if (size === "custom") {

        document
            .getElementById(
                "customLabelControls"
            )
            .classList.add(
                "show"
            );

        return;

    }


    document
        .getElementById(
            "customLabelControls"
        )
        .classList.remove(
            "show"
        );


    if (size === "small") {

        labelSettings.width = 1.5;
        labelSettings.height = 1;

    }


    if (size === "medium") {

        labelSettings.width = 2;
        labelSettings.height = 1.25;

    }


    if (size === "large") {

        labelSettings.width = 3;
        labelSettings.height = 2;

    }


    labelSettings.size =
        size;


    saveData();

    displayBarcodes();

}


function applyCustomSize() {

    const width =
        Number(
            document
                .getElementById(
                    "customWidth"
                )
                .value
        );


    const height =
        Number(
            document
                .getElementById(
                    "customHeight"
                )
                .value
        );


    if (
        width <= 0 ||
        height <= 0
    ) {

        alert(
            "Please enter valid dimensions."
        );

        return;

    }


    labelSettings = {

        size: "custom",

        width,

        height

    };


    saveData();

    displayBarcodes();

}


/* =====================================================
   BARCODE DISPLAY
===================================================== */

function displayBarcodes() {

    const list =
        document.getElementById(
            "barcodeList"
        );


    updateBarcodeSelectionCount();


    if (!products.length) {

        list.innerHTML = `
            <div class="panel">
                <p>Add a product first.</p>
            </div>
        `;

        return;

    }


    list.innerHTML = "";


    products.forEach(
        product => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "barcode-card";


            card.innerHTML = `

                <label class="barcode-select">

                    <input
                        type="checkbox"
                        data-barcode-id="${product.id}"

                        ${
                            selectedBarcodes.has(
                                product.id
                            )
                            ? "checked"
                            : ""
                        }
                    >

                    Select

                </label>


                <div class="barcode-preview">

                    <div
                        class="barcode-preview-name"
                    >
                        ${escapeHTML(
                            product.name
                        )}
                    </div>

                    <svg></svg>

                    <div
                        class="barcode-preview-sku"
                    >
                        ${escapeHTML(
                            product.sku
                        )}
                    </div>

                    <div
                        class="barcode-preview-price"
                    >
                        $${Number(
                            product.price
                        ).toFixed(2)}
                    </div>

                </div>

            `;


            list.appendChild(
                card
            );


            generateBarcode(
                card.querySelector(
                    "svg"
                ),
                product.sku,
                1.8,
                48
            );


            card
                .querySelector(
                    "input"
                )
                .addEventListener(
                    "change",
                    event => {

                        if (
                            event.target.checked
                        ) {

                            selectedBarcodes.add(
                                product.id
                            );

                        } else {

                            selectedBarcodes.delete(
                                product.id
                            );

                        }

                        updateBarcodeSelectionCount();

                    }
                );

        }
    );

}


function generateBarcode(
    element,
    value,
    width = 1.8,
    height = 48
) {

    try {

        JsBarcode(
            element,
            String(value),
            {

                format:
                    "CODE128",

                width,

                height,

                displayValue:
                    false,

                margin:
                    3

            }
        );

    } catch (error) {

        console.error(
            "Barcode error:",
            error
        );

    }

}


function updateBarcodeSelectionCount() {

    document
        .getElementById(
            "barcodeSelectionCount"
        )
        .textContent =
        `${selectedBarcodes.size} selected`;

}


document
    .getElementById(
        "selectAllBarcodes"
    )
    .addEventListener(
        "click",
        () => {

            products.forEach(
                product =>
                    selectedBarcodes.add(
                        product.id
                    )
            );

            displayBarcodes();

        }
    );


document
    .getElementById(
        "clearBarcodeSelection"
    )
    .addEventListener(
        "click",
        () => {

            selectedBarcodes.clear();

            displayBarcodes();

        }
    );


/* =====================================================
   PRINT BARCODES
===================================================== */

document
    .getElementById(
        "printBarcodes"
    )
    .addEventListener(
        "click",
        printBarcodes
    );


function printBarcodes() {

    const selected =
        products.filter(
            product =>
                selectedBarcodes.has(
                    product.id
                )
        );


    if (!selected.length) {

        alert(
            "Select at least one barcode."
        );

        return;

    }


    const printArea =
        document.getElementById(
            "printArea"
        );


    printArea.innerHTML = "";


    printArea.style.setProperty(
        "--print-width",
        `${labelSettings.width}in`
    );


    printArea.style.setProperty(
        "--print-height",
        `${labelSettings.height}in`
    );


    selected.forEach(
        product => {

            const label =
                document.createElement(
                    "div"
                );


            label.className =
                "print-label";


            label.innerHTML = `

                <div
                    class="print-label-name"
                >
                    ${escapeHTML(
                        product.name
                    )}
                </div>

                <svg></svg>

                <div
                    class="print-label-sku"
                >
                    ${escapeHTML(
                        product.sku
                    )}
                </div>

                <div
                    class="print-label-price"
                >
                    $${Number(
                        product.price
                    ).toFixed(2)}
                </div>

            `;


            printArea.appendChild(
                label
            );


            generateBarcode(
                label.querySelector(
                    "svg"
                ),
                product.sku,
                1.5,
                35
            );

        }
    );


    setTimeout(
        () => window.print(),
        500
    );

}


/* =====================================================
   CHECKOUT SEARCH
===================================================== */

document
    .getElementById(
        "checkoutSearch"
    )
    .addEventListener(
        "input",
        displayCheckoutProducts
    );


/* =====================================================
   CHECKOUT PRODUCTS
===================================================== */

function displayCheckoutProducts() {

    const list =
        document.getElementById(
            "checkoutProducts"
        );


    const search =
        document
            .getElementById(
                "checkoutSearch"
            )
            .value
            .toLowerCase();


    const filtered =
        products.filter(
            product =>

                product.name
                    .toLowerCase()
                    .includes(search)

                ||

                String(product.sku)
                    .toLowerCase()
                    .includes(search)

                ||

                (
                    product.category ||
                    ""
                )
                    .toLowerCase()
                    .includes(search)

        );


    list.innerHTML =
        filtered
            .map(
                product => {

                    const out =
                        product.stock <= 0;


                    return `

                        <div
                            class="
                                checkout-product
                                ${out ? "out-of-stock" : ""}
                            "

                            data-product-id="
                                ${product.id}
                            "
                        >

                            <h3>
                                ${escapeHTML(
                                    product.name
                                )}
                            </h3>

                            <div
                                class="
                                checkout-product-price"
                            >
                                $${Number(
                                    product.price
                                ).toFixed(2)}
                            </div>

                            <div
                                class="
                                checkout-product-stock"
                            >
                                ${
                                    out
                                    ? "Out of Stock"
                                    : `${product.stock} available`
                                }
                            </div>

                            ${
                                product.bundle
                                ?

                                `<div class="bundle-badge">
                                    🧺
                                    ${product.bundle.quantity}
                                    for
                                    $${Number(
                                        product.bundle.price
                                    ).toFixed(2)}
                                </div>`

                                :
                                ""
                            }

                        </div>

                    `;

                }
            )
            .join("");


    list
        .querySelectorAll(
            ".checkout-product"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        const product =
                            products.find(
                                p =>
                                    p.id ===
                                    Number(
                                        card.dataset.productId
                                    )
                            );


                        if (
                            product &&
                            product.stock > 0
                        ) {

                            addToCart(
                                product.id
                            );

                        }

                    }
                );

            }
        );

}


/* =====================================================
   SCANNER
===================================================== */

const checkoutScanner =
    document.getElementById(
        "checkoutBarcodeInput"
    );


checkoutScanner.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            event.preventDefault();

            processCheckoutScan();

        }

    }
);


function processCheckoutScan() {

    const code =
        checkoutScanner.value
            .trim();


    if (!code)
        return;


    const product =
        findProductByBarcode(
            code
        );


    if (!product) {

        showCheckoutScanMessage(
            `❌ Barcode not found: ${code}`,
            true
        );

        checkoutScanner.select();

        return;

    }


    if (
        product.stock <= 0
    ) {

        showCheckoutScanMessage(
            `🔴 ${product.name} is out of stock.`,
            true
        );

        checkoutScanner.select();

        return;

    }


    addToCart(
        product.id
    );


    showCheckoutScanMessage(
        `✅ Added 1 × ${product.name}`,
        false
    );


    checkoutScanner.value = "";

    checkoutScanner.focus();

}


function showCheckoutScanMessage(
    message,
    error
) {

    const element =
        document.getElementById(
            "checkoutScanMessage"
        );


    element.textContent =
        message;


    element.classList.toggle(
        "error",
        error
    );


    element.classList.toggle(
        "success",
        !error
    );

}


function focusCheckoutScanner() {

    setTimeout(
        () => {

            if (
                document
                    .getElementById(
                        "checkout"
                    )
                    .classList.contains(
                        "active"
                    )
            ) {

                checkoutScanner.focus();

            }

        },
        100
    );

}


/* =====================================================
   FIND BARCODE
===================================================== */

function findProductByBarcode(
    code
) {

    const clean =
        String(code)
            .trim()
            .toLowerCase();


    return products.find(
        product =>
            String(
                product.sku
            )
            .trim()
            .toLowerCase() ===
            clean
    );

}


/* =====================================================
   BUNDLE PRICE CALCULATION
===================================================== */

function calculateItemTotal(
    product,
    quantity
) {

    const normalPrice =
        Number(product.price);


    if (
        !product.bundle ||
        product.bundle.quantity < 2 ||
        product.bundle.price < 0
    ) {

        return normalPrice *
            quantity;

    }


    const bundleQuantity =
        Number(
            product.bundle.quantity
        );


    const bundlePrice =
        Number(
            product.bundle.price
        );


    const bundles =
        Math.floor(
            quantity /
            bundleQuantity
        );


    const remainder =
        quantity %
        bundleQuantity;


    return (
        bundles *
        bundlePrice
    ) +
    (
        remainder *
        normalPrice
    );

}


function calculateBundleSavings(
    product,
    quantity
) {

    const regular =
        Number(product.price) *
        quantity;


    const bundleTotal =
        calculateItemTotal(
            product,
            quantity
        );


    return Math.max(
        0,
        regular - bundleTotal
    );

}


/* =====================================================
   CART
===================================================== */

function addToCart(
    productId
) {

    const product =
        products.find(
            p =>
                p.id === productId
        );


    if (!product)
        return;


    if (
        product.stock <= 0
    ) {

        alert(
            `${product.name} is out of stock.`
        );

        return;

    }


    const item =
        cart.find(
            item =>
                item.productId ===
                productId
        );


    if (item) {

        if (
            item.quantity >=
            product.stock
        ) {

            alert(
                "You don't have enough stock."
            );

            return;

        }


        item.quantity++;

    } else {

        cart.push({

            productId,

            quantity: 1

        });

    }


    displayCart();

}


function changeCartQuantity(
    productId,
    amount
) {

    const item =
        cart.find(
            x =>
                x.productId ===
                productId
        );


    const product =
        products.find(
            p =>
                p.id === productId
        );


    if (
        !item ||
        !product
    )
        return;


    if (
        amount > 0 &&
        item.quantity >=
        product.stock
    ) {

        alert(
            "You don't have enough stock."
        );

        return;

    }


    item.quantity +=
        amount;


    if (
        item.quantity <= 0
    ) {

        cart =
            cart.filter(
                x =>
                    x.productId !==
                    productId
            );

    }


    displayCart();

}


function clearCart() {

    cart = [];

    displayCart();

}


document
    .getElementById(
        "clearCart"
    )
    .addEventListener(
        "click",
        clearCart
    );


function getCartTotal() {

    return cart.reduce(
        (sum, item) => {

            const product =
                products.find(
                    p =>
                        p.id ===
                        item.productId
                );


            if (!product)
                return sum;


            return sum +
                calculateItemTotal(
                    product,
                    item.quantity
                );

        },
        0
    );

}


function displayCart() {

    const list =
        document.getElementById(
            "cartItems"
        );


    let itemCount = 0;


    if (!cart.length) {

        list.innerHTML = `

            <div class="empty-cart">

                <div>🛒</div>

                <p>
                    Your cart is empty.
                </p>

                <small>
                    Scan or tap a product.
                </small>

            </div>

        `;

    } else {

        list.innerHTML =
            cart
                .map(
                    item => {

                        const product =
                            products.find(
                                p =>
                                    p.id ===
                                    item.productId
                            );


                        if (!product)
                            return "";


                        const total =
                            calculateItemTotal(
                                product,
                                item.quantity
                            );


                        const savings =
                            calculateBundleSavings(
                                product,
                                item.quantity
                            );


                        itemCount +=
                            item.quantity;


                        return `

                            <div class="cart-item">

                                <div>

                                    <div
                                        class="
                                        cart-item-name"
                                    >
                                        ${escapeHTML(
                                            product.name
                                        )}
                                    </div>

                                    <div
                                        class="
                                        quantity-controls"
                                    >

                                        <button
                                            onclick="
                                            changeCartQuantity(
                                                ${product.id},
                                                -1
                                            )
                                            "
                                        >
                                            −
                                        </button>

                                        <strong>
                                            ${item.quantity}
                                        </strong>

                                        <button
                                            onclick="
                                            changeCartQuantity(
                                                ${product.id},
                                                1
                                            )
                                            "
                                        >
                                            +
                                        </button>

                                    </div>

                                    ${
                                        savings > 0
                                        ?

                                        `<div class="bundle-line">
                                            🧺 Bundle saved
                                            $${savings.toFixed(2)}
                                        </div>`

                                        :
                                        ""
                                    }

                                </div>


                                <div
                                    class="
                                    cart-item-price"
                                >
                                    $${total.toFixed(2)}
                                </div>

                            </div>

                        `;

                    }
                )
                .join("");

    }


    const total =
        getCartTotal();


    document
        .getElementById(
            "cartItemCount"
        )
        .textContent =
        `${itemCount} ${
            itemCount === 1
            ? "item"
            : "items"
        }`;


    document
        .getElementById(
            "cartSubtotal"
        )
        .textContent =
        `$${total.toFixed(2)}`;


    document
        .getElementById(
            "cartTotal"
        )
        .textContent =
        `$${total.toFixed(2)}`;

}


/* =====================================================
   CASH CHECKOUT
===================================================== */

const cashModal =
    document.getElementById(
        "cashModal"
    );


document
    .getElementById(
        "cashCheckout"
    )
    .addEventListener(
        "click",
        openCashCheckout
    );


function openCashCheckout() {

    if (!cart.length) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    if (!activeEventId) {

        alert(
            "Please select a craft fair first."
        );

        showPage("events");

        return;

    }


    const total =
        getCartTotal();


    document
        .getElementById(
            "cashTotalDue"
        )
        .textContent =
        `$${total.toFixed(2)}`;


    document
        .getElementById(
            "cashReceived"
        )
        .value = "";


    document
        .getElementById(
            "cashChange"
        )
        .textContent =
        "$0.00";


    document
        .getElementById(
            "cashError"
        )
        .textContent =
        "";


    cashModal.classList.add(
        "show"
    );


    setTimeout(
        () =>
            document
                .getElementById(
                    "cashReceived"
                )
                .focus(),
        100
    );

}


function closeCashModal() {

    cashModal.classList.remove(
        "show"
    );

}


document
    .getElementById(
        "closeCashModal"
    )
    .addEventListener(
        "click",
        closeCashModal
    );


document
    .getElementById(
        "cancelCash"
    )
    .addEventListener(
        "click",
        closeCashModal
    );


/* CASH PRESETS */

document
    .querySelectorAll(
        "[data-cash]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const value =
                    button.dataset.cash;


                const total =
                    getCartTotal();


                if (
                    value ===
                    "exact"
                ) {

                    document
                        .getElementById(
                            "cashReceived"
                        )
                        .value =
                        total.toFixed(2);

                } else {

                    document
                        .getElementById(
                            "cashReceived"
                        )
                        .value =
                        Number(
                            value
                        ).toFixed(2);

                }


                updateCashChange();

            }
        );

    });


document
    .getElementById(
        "cashReceived"
    )
    .addEventListener(
        "input",
        updateCashChange
    );


function updateCashChange() {

    const total =
        getCartTotal();


    const received =
        Number(
            document
                .getElementById(
                    "cashReceived"
                )
                .value
        );


    const change =
        received -
        total;


    const error =
        document.getElementById(
            "cashError"
        );


    if (
        !Number.isFinite(
            received
        ) ||
        received < total
    ) {

        document
            .getElementById(
                "cashChange"
            )
            .textContent =
            "$0.00";


        if (
            Number.isFinite(
                received
            ) &&
            received > 0
        ) {

            error.textContent =
                `Customer still owes $${(
                    total -
                    received
                ).toFixed(2)}`;

        } else {

            error.textContent = "";

        }

        return;

    }


    error.textContent = "";


    document
        .getElementById(
            "cashChange"
        )
        .textContent =
        `$${change.toFixed(2)}`;

}


document
    .getElementById(
        "completeCashSale"
    )
    .addEventListener(
        "click",
        completeCashSale
    );


function completeCashSale() {

    const total =
        getCartTotal();


    const received =
        Number(
            document
                .getElementById(
                    "cashReceived"
                )
                .value
        );


    if (
        !Number.isFinite(
            received
        ) ||
        received < total
    ) {

        document
            .getElementById(
                "cashError"
            )
            .textContent =
            "The amount received is not enough.";

        return;

    }


    const change =
        received -
        total;


    closeCashModal();


    completeSale(
        "Cash",
        {
            cashReceived:
                received,

            changeGiven:
                change
        }
    );

}


/* =====================================================
   CARD CHECKOUT
===================================================== */

const cardModal =
    document.getElementById(
        "cardModal"
    );


document
    .getElementById(
        "cardCheckout"
    )
    .addEventListener(
        "click",
        openCardCheckout
    );


function openCardCheckout() {

    if (!cart.length) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    if (!activeEventId) {

        alert(
            "Please select a craft fair first."
        );

        showPage("events");

        return;

    }


    document
        .getElementById(
            "cardTotalDue"
        )
        .textContent =
        `$${getCartTotal().toFixed(2)}`;


    cardModal.classList.add(
        "show"
    );

}


function closeCardModal() {

    cardModal.classList.remove(
        "show"
    );

}


document
    .getElementById(
        "closeCardModal"
    )
    .addEventListener(
        "click",
        closeCardModal
    );


document
    .getElementById(
        "cancelCard"
    )
    .addEventListener(
        "click",
        closeCardModal
    );


document
    .getElementById(
        "completeCardSale"
    )
    .addEventListener(
        "click",
        () => {

            closeCardModal();

            completeSale(
                "Card"
            );

        }
    );


/* =====================================================
   COMPLETE SALE
===================================================== */

function completeSale(
    paymentMethod,
    paymentDetails = {}
) {

    if (!cart.length) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    if (!activeEventId) {

        alert(
            "Please select a craft fair first."
        );

        showPage("events");

        return;

    }


    for (
        const item of cart
    ) {

        const product =
            products.find(
                p =>
                    p.id ===
                    item.productId
            );


        if (
            !product ||
            product.stock <
            item.quantity
        ) {

            alert(
                "There is not enough stock."
            );

            return;

        }

    }


    let total = 0;

    let itemCount = 0;

    const saleItems = [];


    cart.forEach(
        item => {

            const product =
                products.find(
                    p =>
                        p.id ===
                        item.productId
                );


            const lineTotal =
                calculateItemTotal(
                    product,
                    item.quantity
                );


            total +=
                lineTotal;


            itemCount +=
                item.quantity;


            const savings =
                calculateBundleSavings(
                    product,
                    item.quantity
                );


            product.stock -=
                item.quantity;


            saleItems.push({

                productId:
                    product.id,

                name:
                    product.name,

                sku:
                    product.sku,

                quantity:
                    item.quantity,

                price:
                    product.price,

                total:
                    lineTotal,

                bundleSavings:
                    savings

            });

        }
    );


    const sale = {

        id:
            Date.now(),

        date:
            new Date()
                .toISOString(),

        eventId:
            activeEventId,

        paymentMethod,

        total,

        itemCount,

        items:
            saleItems,

        cashReceived:
            paymentDetails.cashReceived ||
            null,

        changeGiven:
            paymentDetails.changeGiven ||
            0

    };


    sales.push(
        sale
    );


    cart = [];


    saveData();

    refreshEverything();


    if (
        paymentMethod ===
        "Cash"
    ) {

        alert(
            `Sale Complete!\n\n` +
            `Cash: $${total.toFixed(2)}\n` +
            `Received: $${paymentDetails.cashReceived.toFixed(2)}\n` +
            `Change: $${paymentDetails.changeGiven.toFixed(2)}`
        );

    } else {

        alert(
            `Sale Complete!\n\n` +
            `Card\n` +
            `$${total.toFixed(2)}`
        );

    }

}


/* =====================================================
   STOCK SCANNER
===================================================== */

const stockScanner =
    document.getElementById(
        "stockBarcodeInput"
    );


stockScanner.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            event.preventDefault();

            processStockScan();

        }

    }
);


function processStockScan() {

    const code =
        stockScanner.value
            .trim();


    if (!code)
        return;


    const product =
        findProductByBarcode(
            code
        );


    if (!product) {

        showStockScanMessage(
            `❌ Barcode not found: ${code}`,
            true
        );

        hideStockProduct();

        stockScanner.select();

        return;

    }


    scannedStockProductId =
        product.id;


    displayScannedStockProduct();


    showStockScanMessage(
        `✅ Found ${product.name}`,
        false
    );


    stockScanner.value = "";

    stockScanner.focus();

}


function displayScannedStockProduct() {

    const product =
        products.find(
            p =>
                p.id ===
                scannedStockProductId
        );


    if (!product) {

        hideStockProduct();

        return;

    }


    document
        .getElementById(
            "stockProductCard"
        )
        .classList.remove(
            "hidden"
        );


    document
        .getElementById(
            "stockProductName"
        )
        .textContent =
        product.name;


    document
        .getElementById(
            "stockProductSKU"
        )
        .textContent =
        `SKU: ${product.sku}`;


    document
        .getElementById(
            "stockProductCount"
        )
        .textContent =
        product.stock;

}


function hideStockProduct() {

    scannedStockProductId =
        null;


    document
        .getElementById(
            "stockProductCard"
        )
        .classList.add(
            "hidden"
        );

}


function addOneStock() {

    if (
        !scannedStockProductId
    ) {

        alert(
            "Scan a product first."
        );

        return;

    }


    const product =
        products.find(
            p =>
                p.id ===
                scannedStockProductId
        );


    if (!product)
        return;


    product.stock++;


    saveData();

    displayScannedStockProduct();

    refreshEverything();


    showStockScanMessage(
        `➕ Added 1 — ${product.name} now has ${product.stock}`,
        false
    );


    stockScanner.focus();

}


function removeOneStock() {

    if (
        !scannedStockProductId
    ) {

        alert(
            "Scan a product first."
        );

        return;

    }


    const product =
        products.find(
            p =>
                p.id ===
                scannedStockProductId
        );


    if (!product)
        return;


    if (
        product.stock <= 0
    ) {

        showStockScanMessage(
            "🔴 Stock is already 0.",
            true
        );

        return;

    }


    product.stock--;


    saveData();

    displayScannedStockProduct();

    refreshEverything();


    showStockScanMessage(
        `➖ Removed 1 — ${product.name} now has ${product.stock}`,
        false
    );


    stockScanner.focus();

}


document
    .getElementById(
        "addStockButton"
    )
    .addEventListener(
        "click",
        addOneStock
    );


document
    .getElementById(
        "removeStockButton"
    )
    .addEventListener(
        "click",
        removeOneStock
    );


function showStockScanMessage(
    message,
    error
) {

    const element =
        document.getElementById(
            "stockScanMessage"
        );


    element.textContent =
        message;


    element.classList.toggle(
        "error",
        error
    );


    element.classList.toggle(
        "success",
        !error
    );

}


function focusStockScanner() {

    setTimeout(
        () => {

            if (
                document
                    .getElementById(
                        "stockScanner"
                    )
                    .classList.contains(
                        "active"
                    )
            ) {

                stockScanner.focus();

            }

        },
        100
    );

}


/* =====================================================
   EVENTS
===================================================== */

const eventModal =
    document.getElementById(
        "eventModal"
    );


document
    .getElementById(
        "newEvent"
    )
    .addEventListener(
        "click",
        openEventModal
    );


function openEventModal() {

    document
        .getElementById(
            "eventName"
        )
        .value = "";


    document
        .getElementById(
            "eventDate"
        )
        .value =
        new Date()
            .toISOString()
            .split("T")[0];


    eventModal.classList.add(
        "show"
    );

}


function closeEventModal() {

    eventModal.classList.remove(
        "show"
    );

}


document
    .getElementById(
        "closeEventModal"
    )
    .addEventListener(
        "click",
        closeEventModal
    );


document
    .getElementById(
        "cancelEvent"
    )
    .addEventListener(
        "click",
        closeEventModal
    );


document
    .getElementById(
        "saveEvent"
    )
    .addEventListener(
        "click",
        createEvent
    );


function createEvent() {

    const name =
        document
            .getElementById(
                "eventName"
            )
            .value
            .trim();


    const date =
        document
            .getElementById(
                "eventDate"
            )
            .value;


    if (!name) {

        alert(
            "Please enter a craft fair name."
        );

        return;

    }


    const event = {

        id:
            String(
                Date.now()
            ),

        name,

        date

    };


    events.push(
        event
    );


    activeEventId =
        event.id;


    saveData();

    closeEventModal();

    displayEvents();


    alert(
        "Craft fair created and selected."
    );

}


/* =====================================================
   DISPLAY EVENTS
===================================================== */

function displayEvents() {

    const activeContainer =
        document.getElementById(
            "activeEvent"
        );


    const list =
        document.getElementById(
            "eventsList"
        );


    const active =
        events.find(
            event =>
                String(
                    event.id
                ) ===
                String(
                    activeEventId
                )
        );


    if (active) {

        const eventSales =
            sales.filter(
                sale =>
                    String(
                        sale.eventId
                    ) ===
                    String(
                        active.id
                    )
            );


        const total =
            eventSales.reduce(
                (sum, sale) =>
                    sum +
                    Number(
                        sale.total
                    ),
                0
            );


        const items =
            eventSales.reduce(
                (sum, sale) =>
                    sum +
                    Number(
                        sale.itemCount
                    ),
                0
            );


        activeContainer.innerHTML = `

            <div class="active-event">

                <h2>
                    🟢 Active Craft Fair
                </h2>

                <h3>
                    ${escapeHTML(
                        active.name
                    )}
                </h3>

                <p>
                    ${formatDate(
                        active.date
                    )}
                </p>

                <div class="event-stats">

                    <div class="event-stat">

                        <strong>
                            $${total.toFixed(2)}
                        </strong>

                        <span>
                            Sales
                        </span>

                    </div>


                    <div class="event-stat">

                        <strong>
                            ${items}
                        </strong>

                        <span>
                            Items
                        </span>

                    </div>


                    <div class="event-stat">

                        <button
                            class="small-btn"
                            onclick="
                                finishEvent()
                            "
                        >
                            Finish Event
                        </button>

                    </div>

                </div>

            </div>

        `;

    } else {

        activeContainer.innerHTML =
            "";

    }


    list.innerHTML =
        events
            .slice()
            .reverse()
            .map(
                event => {

                    const eventSales =
                        sales.filter(
                            sale =>
                                String(
                                    sale.eventId
                                ) ===
                                String(
                                    event.id
                                )
                        );


                    const total =
                        eventSales.reduce(
                            (sum, sale) =>
                                sum +
                                Number(
                                    sale.total
                                ),
                            0
                        );


                    const items =
                        eventSales.reduce(
                            (sum, sale) =>
                                sum +
                                Number(
                                    sale.itemCount
                                ),
                            0
                        );


                    const isActive =
                        String(
                            event.id
                        ) ===
                        String(
                            activeEventId
                        );


                    return `

                        <div class="event-card">

                            <h3>

                                ${
                                    isActive
                                    ? "🟢 "
                                    : ""
                                }

                                ${escapeHTML(
                                    event.name
                                )}

                            </h3>

                            <p>
                                ${formatDate(
                                    event.date
                                )}
                            </p>

                            <p>
                                💰
                                $${total.toFixed(2)}
                            </p>

                            <p>
                                🧸
                                ${items}
                                items sold
                            </p>

                            ${
                                !isActive

                                ?

                                `<button
                                    class="primary-btn"
                                    onclick="
                                        selectEvent(
                                            '${event.id}'
                                        )
                                    "
                                >
                                    Select
                                </button>`

                                :

                                `<strong>
                                    🟢 Active
                                </strong>`
                            }

                        </div>

                    `;

                }
            )
            .join("");

}


function selectEvent(id) {

    activeEventId =
        String(id);

    saveData();

    displayEvents();

    alert(
        "Craft fair selected."
    );

}


function finishEvent() {

    activeEventId =
        "";

    saveData();

    displayEvents();

}


/* =====================================================
   SALES
===================================================== */

function displaySales() {

    const total =
        sales.reduce(
            (sum, sale) =>
                sum +
                Number(
                    sale.total
                ),
            0
        );


    const items =
        sales.reduce(
            (sum, sale) =>
                sum +
                Number(
                    sale.itemCount
                ),
            0
        );


    const cash =
        sales
            .filter(
                sale =>
                    sale.paymentMethod ===
                    "Cash"
            )
            .reduce(
                (sum, sale) =>
                    sum +
                    Number(
                        sale.total
                    ),
                0
            );


    document
        .getElementById(
            "salesTotal"
        )
        .textContent =
        `$${total.toFixed(2)}`;


    document
        .getElementById(
            "salesItems"
        )
        .textContent =
        items;


    document
        .getElementById(
            "salesTransactions"
        )
        .textContent =
        sales.length;


    document
        .getElementById(
            "salesCash"
        )
        .textContent =
        `$${cash.toFixed(2)}`;


    displayBestSellers();

    displayPaymentBreakdown();

    displaySalesHistory();

}


/* =====================================================
   BEST SELLERS
===================================================== */

function getBestSellerData() {

    const totals = {};


    sales.forEach(
        sale => {

            sale.items.forEach(
                item => {

                    if (
                        !totals[
                            item.productId
                        ]
                    ) {

                        totals[
                            item.productId
                        ] = {

                            name:
                                item.name,

                            quantity:
                                0

                        };

                    }


                    totals[
                        item.productId
                    ].quantity +=
                        Number(
                            item.quantity
                        );

                }
            );

        }
    );


    return Object.values(
        totals
    )
        .sort(
            (a, b) =>
                b.quantity -
                a.quantity
        );

}


function displayBestSellers() {

    const container =
        document.getElementById(
            "bestSellers"
        );


    const best =
        getBestSellerData();


    if (!best.length) {

        container.innerHTML =
            "<p>No sales yet.</p>";

        return;

    }


    container.innerHTML =
        best
            .slice(0, 10)
            .map(
                (
                    item,
                    index
                ) => `

                    <div
                        class="
                        best-seller-row"
                    >

                        <span>
                            ${index + 1}.
                            ${escapeHTML(
                                item.name
                            )}
                        </span>

                        <strong>
                            ${item.quantity}
                            sold
                        </strong>

                    </div>

                `
            )
            .join("");

}


/* =====================================================
   PAYMENT BREAKDOWN
===================================================== */

function displayPaymentBreakdown() {

    let cash = 0;

    let card = 0;


    sales.forEach(
        sale => {

            if (
                sale.paymentMethod ===
                "Cash"
            )
                cash +=
                    Number(
                        sale.total
                    );


            if (
                sale.paymentMethod ===
                "Card"
            )
                card +=
                    Number(
                        sale.total
                    );

        }
    );


    document
        .getElementById(
            "paymentBreakdown"
        )
        .innerHTML = `

            <div
                class="
                best-seller-row"
            >

                <span>
                    💵 Cash
                </span>

                <strong>
                    $${cash.toFixed(2)}
                </strong>

            </div>

            <div
                class="
                best-seller-row"
            >

                <span>
                    💳 Card
                </span>

                <strong>
                    $${card.toFixed(2)}
                </strong>

            </div>

        `;

}


/* =====================================================
   SALES HISTORY
===================================================== */

function displaySalesHistory() {

    const container =
        document.getElementById(
            "salesHistory"
        );


    if (!sales.length) {

        container.innerHTML =
            "<p>No sales yet.</p>";

        return;

    }


    container.innerHTML =
        sales
            .slice()
            .reverse()
            .slice(0, 50)
            .map(
                sale => `

                    <div class="sale-row">

                        <div>
                            ${formatDateTime(
                                sale.date
                            )}
                        </div>

                        <div>
                            ${sale.itemCount}
                            items
                        </div>

                        <div>
                            ${escapeHTML(
                                sale.paymentMethod
                            )}
                        </div>

                        <div>

                            <strong>
                                $${Number(
                                    sale.total
                                ).toFixed(2)}
                            </strong>

                            ${
                                sale.paymentMethod ===
                                "Cash" &&
                                sale.cashReceived != null

                                ?

                                `<small
                                    class="cash-sale-info"
                                >
                                    Received:
                                    $${Number(
                                        sale.cashReceived
                                    ).toFixed(2)}

                                    • Change:
                                    $${Number(
                                        sale.changeGiven
                                    ).toFixed(2)}
                                </small>`

                                :
                                ""
                            }

                        </div>


                        <button
                            class="undo-sale-btn"
                            onclick="
                                undoSale(
                                    ${sale.id}
                                )
                            "
                        >
                            ↩️ Undo
                        </button>

                    </div>

                `
            )
            .join("");

}


/* =====================================================
   UNDO SALE
===================================================== */

function undoSale(
    saleId
) {

    const sale =
        sales.find(
            s =>
                Number(s.id) ===
                Number(saleId)
        );


    if (!sale)
        return;


    const confirmed =
        confirm(
            `Undo this sale for $${Number(
                sale.total
            ).toFixed(2)}?\n\n` +
            `The inventory will be returned.`
        );


    if (!confirmed)
        return;


    sale.items.forEach(
        item => {

            const product =
                products.find(
                    p =>
                        p.id ===
                        item.productId
                );


            if (product) {

                product.stock +=
                    Number(
                        item.quantity
                    );

            }

        }
    );


    sales =
        sales.filter(
            s =>
                Number(s.id) !==
                Number(saleId)
        );


    saveData();

    refreshEverything();


    alert(
        "Sale undone and inventory restored."
    );

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    const totalStock =
        products.reduce(
            (sum, product) =>
                sum +
                Number(
                    product.stock
                ),
            0
        );

    const inventoryValue =
        products.reduce(
            (sum, product) =>
                sum +
                (Number(product.stock) *
                 Number(product.price)),
            0
        );


    const lowStock =
        products.filter(
            product =>
                product.stock <=
                product.lowStock
        );


    const totalSales =
        sales.reduce(
            (sum, sale) =>
                sum +
                Number(
                    sale.total
                ),
            0
        );


    document
        .getElementById(
            "dashboardProducts"
        )
        .textContent =
        products.length;


    document
        .getElementById(
            "dashboardStock"
        )
        .textContent =
        totalStock;


    document
        .getElementById(
            "dashboardLowStock"
        )
        .textContent =
        lowStock.length;


    document
        .getElementById(
            "dashboardSales"
        )
        .textContent =
        `${totalSales.toFixed(2)}`;

    document
        .getElementById(
            "dashboardInventoryValue"
        )
        .textContent =
        `${inventoryValue.toFixed(2)}`;


    const lowList =
        document.getElementById(
            "dashboardLowStockList"
        );


    if (!lowStock.length) {

        lowList.innerHTML =
            "<p>🟢 Everything is stocked!</p>";

    } else {

        lowList.innerHTML =
            lowStock
                .map(
                    product => `

                        <div
                            class="
                            best-seller-row"
                        >

                            <span>
                                ${escapeHTML(
                                    product.name
                                )}
                            </span>

                            <strong>
                                ${product.stock}
                                left
                            </strong>

                        </div>

                    `
                )
                .join("");

    }


    const best =
        getBestSellerData();


    const bestList =
        document.getElementById(
            "dashboardBestSellers"
        );


    if (!best.length) {

        bestList.innerHTML =
            "<p>No sales yet.</p>";

    } else {

        bestList.innerHTML =
            best
                .slice(0, 5)
                .map(
                    (
                        item,
                        index
                    ) => `

                        <div
                            class="
                            best-seller-row"
                        >

                            <span>
                                ${index + 1}.
                                ${escapeHTML(
                                    item.name
                                )}
                            </span>

                            <strong>
                                ${item.quantity}
                                sold
                            </strong>

                        </div>

                    `
                )
                .join("");

    }

}


/* =====================================================
   HELPERS
===================================================== */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


function formatDate(
    date
) {

    if (!date)
        return "No date";


    return new Date(
        date + "T00:00:00"
    )
        .toLocaleDateString();

}


function formatDateTime(
    date
) {

    return new Date(
        date
    )
        .toLocaleString();

}


/* =====================================================
   REFRESH
===================================================== */

function refreshEverything() {

    displayInventory();

    displayBarcodes();

    displayCheckoutProducts();

    displayCart();

    displayEvents();

    displaySales();

    updateDashboard();

}


/* =====================================================
   INITIALIZE LABEL SETTINGS
===================================================== */

document
    .getElementById(
        "labelSize"
    )
    .value =
    labelSettings.size;


if (
    labelSettings.size ===
    "custom"
) {

    document
        .getElementById(
            "customLabelControls"
        )
        .classList.add(
            "show"
        );


    document
        .getElementById(
            "customWidth"
        )
        .value =
        labelSettings.width;


    document
        .getElementById(
            "customHeight"
        )
        .value =
        labelSettings.height;

}


/* =====================================================
   START
===================================================== */

refreshEverything();
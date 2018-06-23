
const base_url = 'http://localhost:8080/deo-api/public/';

// get current page name
const currentLoc = window.location.pathname.split('/');
const currentPage = currentLoc[currentLoc.length - 1];
// booleans to be used for page determination before running certain script
const isBookingPage = (currentPage === '');
const isInvoicePage = (currentPage === 'invoice.html');

let results = [];
let result = {};
let currentHallPrice = 0;
let totalItemPrice = 0;
let totalGST = 0;
let totalDamage = 0;
let totalServiceTax = 0;
let totalPaid = 0;
let itemListDetailForDB = []; // to save in db just do join(',')

class Booking {
    constructor(id,bookingid,customer,fromdate,todate,phone,total,paid,createdOn,status,address,mail) {
        this.id = id;
        this.bookingid = bookingid;
        this.customer =customer;
        this.fromdate = fromdate;
        this.todate = todate;
        this.phone = phone;
        this.total = total;
        this.paid = paid;
        this.createdOn = createdOn;
        this.status = status;
        this.address = address;
        this.mail = mail;
    }

}

const invoice = {
    invoiceNum : '',
    date : new Date(),
    customer : '',
    address : '',
    mail : '',
    phone : '',
    payStatus : '',
    items : [],
    halls : [],
    total : 0
}

/**
 * This is parent method to hit axios for data
 * @param {string} req_uri 
 */
async function getData(req_uri) {
    let response;
    // if req_uri is not set for any reason
    if(!req_uri) return;

    try {
        response = await axios.get(base_url+req_uri);
    } catch(e) {
        console.log(e);
    }
    
    return response.data;
}

/**
 * User function to call getData method with URL to get single row
 * @param {string} uri 
 */
async function getAll(uri) {
    const data = await getData(uri);
    results = data.map(element => {
        return element;
    });
}

/**
 * User function to call getData method with URL to get all result
 * @param {string} uri 
 */
async function getOne(uri) {
    //result = {};
    const data = await getData(uri);
    result = data;
}

/**
 * Return static string with interpolated booking, for card start
 * @param {string} booking 
 */
function getBookingCardStart(booking) {
    return `
    <div class="col-md-4" id=${booking.bookingid}>
    <div class="card border-success mb-4 box-shadow" id="card-${booking.bookingid}">
    <p style="margin:10px 0 0 10px; text-align:left;"></p>
    <h5 style="margin:10px 0 0 10px; text-align:center;">${booking.status} ${booking.customer}</h5>
    <div class="card-body">
        <p class="card-text">
            <table class="table table-sm" id="${booking.bookingid}-table">
                <thead>
                    <tr>
                        <th scope="col">Booking Id</th>
                        <td scope="col">${booking.id}</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>From</td>
                        <td>${booking.fromdate}</td>
                    </tr>
                    <tr>
                        <td>To</td>
                        <td>${booking.todate}</td>
                    </tr>
                    <tr>
                        <td>Phone</td>
                        <td>${booking.phone}</td>
                    </tr>
                    <tr>
                        <td>Total Bill</td>
                        <td>${booking.total}</td>
                    </tr>
                    <tr>
                        <td>Paid</td>
                        <td>${booking.paid}</td>
                    </tr>
                </tbody>
            </table>
        </p>
        <div class="d-flex justify-content-between align-items-center">
            <div class="btn-group">
                <a href="invoice.html" id="bill-${booking.id}" type="button" class="btn btn-sm btn-outline-primary">Bill</a>
                <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                <button type="button" class="btn btn-sm btn-outline-danger">Delete</button>
            </div>
            <small class="text-muted">${booking.createdOn}</small>
        </div>
    </div>
    </div>
    </div>`;
}

/**
 * inititializer
 * Always run only on main page
 */
(function init() {
    if(isBookingPage) {
        const res = initBookingInDOM();
        populateBookingInDOM(res);
    }
})();

/**
 * Populate all bookings
 */
async function populateBookingInDOM(res) {
    const response = await res;
    const card = document.getElementById('calCard');
    if(card){
        response.forEach((cur)=>{
            card.insertAdjacentHTML('beforeEnd', getBookingCardStart(cur));
            const billId = document.getElementById(`bill-${cur.id}`);
            billId.addEventListener('click', ()=>{
                setInvoice(cur);
            });
        });
    }
}

/**
 * Set invoice object property from currently clicked booking
 * @param {Object} booking 
 */
function setInvoice(booking) {
    invoice.invoiceNum = booking.bookingid.replace(/[^a-zA-Z0-9]/g, ''); //remove all spcl char
    invoice.date = booking.createdOn;
    invoice.customer = booking.customer;
    invoice.address = booking.address;
    invoice.mail = booking.mail;
    invoice.phone = booking.phone;
    invoice.payStatus = ((booking.total - booking.paid) === 0) ? '<span class="badge badge-success">Paid</span>' : '<span class="badge badge-danger">Pending</span>'; 
    invoice.items = [];
    invoice.halls = [];
    invoice.total = 0;

    localStorage.invoiceData = JSON.stringify(invoice);
}


/**
 * Real function to populate DOM with booking
 */
async function initBookingInDOM() {
    const allBookings = [];
    await getAll('bookings');
    
    results.forEach(res=>{
        allBookings.push(new Booking(
            res.id,
            res.bookingid,
            res.customer,
            moment(res.fromdate).format('DD-MMM-YYYY'),
            moment(res.todate).format('DD-MMM-YYYY'),
            res.phone,
            res.total, 
            res.paid,
            moment(res.created_on).format('DD-MMM-YYYY'),
            (isGreaterThanNow(res.todate)) ? '<span style="cursor:pointer" title="New">✔</span>' : '<span style="cursor:pointer" title="Over">✖</span>', 
            res.address, 
            res.email)
        );
    });
    return allBookings;
}

/**
 * Compare date
 */
function isGreaterThanNow(date) {
    // Get todays date to chk if event is done or not
    const now = new Date();
    const _now = moment(now).format('DD-MMM-YYYY');

    return (moment(date).format('DD-MMM-YYYY') > _now);
}

/**
 * Used for ID generation in sub-scripts
 */
function generateUniqueID(type) {
    const today = new Date();
    const date = today.getDate();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDay();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();

    const monthArray =  [
        'January',
        'February', 
        'March', 
        'April', 
        'May', 
        'June', 
        'July', 
        'August', 
        'September',
        'October', 
        'November', 
        'December'
    ];

    return `${type}-${year}-${monthArray[month]}-${date}-${hours}-${minutes}-${seconds}`;
}

/**
 * Change Date prototype to Convert JS date to Mysql DateTime
 * usage: date.toSQLDATETIME()
 */
(function() {
    Date.prototype.toSQLDATETIME = Date_toSQLDATETIME;
    function Date_toSQLDATETIME() {
        var year, month, day;
        year = String(this.getFullYear());
        month = String(this.getMonth() + 1);
        if (month.length == 1) {
            month = "0" + month;
        }
        day = String(this.getDate());
        if (day.length == 1) {
            day = "0" + day;
        }
        return year + "-" + month + "-" + day;
    }
})();

/**
 * Booking model initializer
 */
function initBookingModel() {
    totalPaidHandler();
    addHallsInBooking();
    addItemRowsInBooking();
    calculatePrice();

    // check if input type is number dont allow user to set empty
    document.addEventListener('change', (e)=>{
        if(e.target.type === 'number' && !e.target.value) {
            e.target.value = 0;
        }
    });
}

/**
 * Populate Item rows in booking model
 */
async function addItemRowsInBooking() {
    await getAll('items');
    let idIndex = 0;
    let totalItems = results.length;
    const itemDOM = document.getElementById('items');

    results.forEach(res=>{
        const itemRow =
        `<div class="form-row">
            <div class="form-group col-md-3 mb-2">
                <label class="col-form-label">${res.name}</label>
                <input type="text" id="item_name_${idIndex}" value="${res.name}" hidden>
            </div>
            <div class="form-group col-md-3 mb-2">
                <input type="number" class="form-control" id="item_price_${idIndex}" value="${res.price}" min="0">
            </div>
            <div class="form-group col-md-3 mb-2">
                <input type="number" class="form-control" id="item_quant_${idIndex}" value="0" min="0">
            </div>
            <div class="form-group col-md-3 mb-2">
                <input type="number" class="form-control" id="item_total_${idIndex}" value="0" readonly>
            </div>
        </div>`;
        itemDOM.insertAdjacentHTML('beforeEnd', itemRow);
        idIndex++;
    });

    // Events for price calculation
    itemDOM.addEventListener('change', (event)=>{
        const currentIndex = event.srcElement.id.split('_')[2];
        const price = document.getElementById('item_price_'+currentIndex).value;
        const quant = document.getElementById('item_quant_'+currentIndex).value;
        document.getElementById('item_total_'+currentIndex).value = parseInt(price)*parseInt(quant);

        // add all item bill to total
        itemListDetailForDB = [];
        let totalItemBill = 0;
        for(let i=0; i < totalItems; i++) {
            if(document.getElementById('item_total_'+i).value) {
                totalItemBill += parseInt(document.getElementById('item_total_'+i).value);
                itemListDetailForDB.push[
                    document.getElementById('item_name_'+i).value+':'+
                    document.getElementById('item_quant_'+i).value+':'+
                    document.getElementById('item_price_'+i).value
                ];
            }
        }
        // update global totalItemPrice with this
        totalItemPrice = totalItemBill;

        const netTotal =  currentHallPrice + totalItemPrice + totalDamage + totalGST + totalServiceTax;
        document.getElementById('total_bill').value = netTotal;
        
        document.getElementById('due').value = netTotal - totalPaid;
    });
}

/**
 * Populate Halls in booking select list
 */
async function addHallsInBooking() {
    await getAll('halls');

    results.forEach(res=>{
        const option =
        `<option>${res.name} | Rs.${res.price}</option>
        `;
        document.getElementById('hallSelect').insertAdjacentHTML('beforeEnd', option);
    });

    // Set Current hall price as global
    const hallOptionDOM = document.getElementById('hallSelect');
    currentHallPrice =  parseInt(hallOptionDOM.value.split(' | ')[1].split('.')[1]);
    document.getElementById('total_bill').value =  currentHallPrice;
    
    hallOptionDOM.addEventListener('change', (e)=>{
        const hallPrice = parseInt(e.srcElement.value.split(' | ')[1].split('.')[1]);
        const totalBill = parseInt(document.getElementById('total_bill').value) - currentHallPrice;
        document.getElementById('total_bill').value = (totalBill + hallPrice + totalDamage + totalGST + totalServiceTax) - totalPaid;
        currentHallPrice = hallPrice;
        const totalValue = document.getElementById('total_bill').value;
        document.getElementById('due').value = parseInt(totalValue) - totalPaid;
    });

}

/**
 * Total price calculator
 */
function calculatePrice() {
    const otherPriceDOM = document.getElementById('other_price');
    otherPriceDOM.addEventListener('change', (e)=>{
        
        switch(e.target.id) {
            case 'damage': 
                totalDamage =  (e.target.value) ? parseInt(e.target.value) : 0;
                break;
            case 'gst': 
                totalGST = (e.target.value) ? parseInt(e.target.value) : 0;
                break;
            case 'service_tax':
                totalServiceTax = (e.target.value) ? parseInt(e.target.value) : 0;
                break;
            default : return;
        }

        document.getElementById('total_bill').value = currentHallPrice + totalItemPrice + totalDamage + totalGST + totalServiceTax;
        const totalValue = document.getElementById('total_bill').value;
        document.getElementById('due').value = parseInt(totalValue) - totalPaid;
    });
}

/**
 * Paid claculator
 */
function totalPaidHandler() {
    const paidDOM = document.getElementById('paid');
    paidDOM.addEventListener('change', (e)=>{
        console.log(e.target.type);
        totalPaid = (e.target.value) ? parseInt(e.target.value) : 0;
        const totalValue = document.getElementById('total_bill').value;
        document.getElementById('due').value = parseInt(totalValue) - totalPaid;
    });
}

/**
 * Test function to test DOM componenets 
 */
function testDOM() {
    return [
        new Booking(101,'B-2018-june-11-12-04','Customer First','20-May-2018','22-May-2018','8861728005',200000, 150000,'June-11-2018','<span style="cursor:pointer" title="New">✔</span>', '301, 8th Cross Road Electronic city, Bangalore', 'cust0@gmail.com'),

        new Booking(102,'B-2018-june-11-12-05','Customer Sec','23-May-2018','25-May-2018','9061728555',500000, 250000,'June-08-2018','<span title="Over">✔</span>', '301, 8th Cross Road Electronic city, Bangalore', 'cust1@gmail.com'),

        new Booking(103,'B-2018-june-11-12-06','Customer Third','23-May-2018','25-May-2018','9061728555',200000, 200000,'June-08-2018','<span title="Over">✖</span>', '301, 8th Cross Road Electronic city, Bangalore', 'cust2@gmail.com'),

        new Booking(104,'B-2018-june-11-12-07','Obama One','22-May-2018','25-May-2018','9061728555',300000, 150000,'June-08-2018','<span title="Over">✔</span>', '301, 8th Cross Road Electronic city, Bangalore', 'cust3@gmail.com'),

        new Booking(105,'B-2018-june-11-12-08','Trump Trump','24-May-2018','25-May-2018','9061728555',50000, 10000,'June-08-2018','<span title="New">✖</span>', '301, 8th Cross Road Electronic city, Bangalore', 'cust4@gmail.com'), 

        new Booking(106,'B-2018-june-11-12-09','Varun Ved','28-May-2018','30-May-2018','9061728555',300000, 300000,'June-08-2018','<span title="New">✔</span>', '301, 8th Cross Road Electronic city, Bangalore', 'cust5@gmail.com'),

        new Booking(107,'B-2018-june-11-12-10','Selva Kumar','30-May-2018','02-June-2018','9061728555',60000,50000,'June-08-2018','<span title="New">✔</span>', '301, 8th Cross Road Electronic city, Bangalore', 'cust6@gmail.com'),

        new Booking(108,'B-2018-june-11-12-11','Navin Singh','23-May-2018','25-May-2018','9061728555',5000,5000,'June-08-2018', '<span title="Over">✖</span>', '301, 8th Cross Road Electronic city, Bangalore', 'cust8@gmail.com'),    
    ];
}
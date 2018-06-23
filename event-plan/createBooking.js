const BOOKING_ID = document.getElementById('booking_id');
const CUSTOMER_NAME = document.getElementById('cust_name');

function bookingFormSubmit() {
    const formObj = {};

    const bookingId = generateUniqueID('B');
    const custName = CUSTOMER_NAME.value;
    const address = document.getElementById('cust_addr').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('mobile').value;

    const invoiceNum = document.getElementById('invoice_num').value;
    const gstNum = document.getElementById('gst_num').value;
    const approxPplNum = parseInt(document.getElementById('no_ppl').value);
    
    const hallSelected = document.getElementById('hallSelect').value;
    const hallPrice = hallSelected.split(' | ')[1].split('.')[1];
    const hallName = hallSelected.split(' | ')[0];
    const finalFormatedHallPrice = `${hallName}:${hallPrice}`;

    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    const itemListDetails = itemListDetailForDB.join(',');

    const gst =  totalGST;
    const damage = totalDamage;
    const serveTax = totalServiceTax;
    const paid = totalPaid;
    const totalBill = currentHallPrice + totalItemPrice + totalGST + totalDamage + totalServiceTax;

    formObj.bookingid = bookingId;
    formObj.fromdate = startDate.toSQLDATETIME();
    formObj.todate = endDate.toSQLDATETIME();
    formObj.customer = custName;
    formObj.phone = phone;
    formObj.address = address;
    formObj.email = email;
    formObj.numberOfPpl = approxPplNum;
    formObj.allItems = itemListDetails;
    formObj.allHall = finalFormatedHallPrice;
    formObj.damage = damage;
    formObj.gst = gst;
    formObj.service_tax = serveTax;
    formObj.total = totalBill;
    formObj.paid = paid;
    formObj.invoice_num = invoiceNum;
    formObj.gst_num = gstNum;
    //console.log(JSON.stringify(formObj));
    return (custName) ? JSON.stringify(formObj) : false;
}

// Event handler for booking save 
const saveBookingDOM = document.getElementById('save_booking');
saveBookingDOM.addEventListener('click', ()=>{
    const formString = bookingFormSubmit();
    
    if(formString) {
        const formObj = JSON.parse(formString);
        // Performing a POST request
        axios.post('http://localhost:8080/deo-api/public/booking', formObj)
        .then(function(response){
            console.log('saved successfully')
        }); 
        saveBookingDOM.style.display = 'none';
        document.getElementById('booking_modal_body').innerHTML = `
            <div class="card border-success mb-3" id="booking_success" style="max-width: 18rem; margin-right:auto; margin-left:auto;">
                <div class="card-header">
                    <h3 style="text-align:center; color: rgba(5, 102, 5, 0.74)">Booking done successfully!!</h3>
                </div>
                <div class="card-body text-success">
                    <h5 class="card-title text-warning">${formObj.customer}</h5>
                    <div class="card-text">
                        <table class="table table-sm">
                            <thead class="text-warning">
                                <tr>
                                    <th scope="col">From</th>
                                    <th scope="col">${formObj.fromdate}</th>
                                </tr>
                                <tr>
                                    <th scope="col">To</th>
                                    <th scope="col">${formObj.todate}</th>
                                </tr>
                                <tr>
                                    <th scope="col">Phone</th>
                                    <th scope="col">${formObj.phone}</th>
                                </tr>
                                <tr>
                                    <th scope="col">Total Bill</th>
                                    <th scope="col">${formObj.total}</th>
                                </tr>
                                <tr>
                                    <th scope="col">Paid</th>
                                    <th scope="col">${formObj.paid}</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>`;
        setTimeout(()=>{
            $('#booking_success').addClass('animated jackInTheBox');
        }, 100);
    } else {
        CUSTOMER_NAME.style.borderColor = '#dc3545';
        CUSTOMER_NAME.focus();
        document.getElementById('cust_name_error').innerHTML = `<i class="fas fa-exclamation-circle"></i> Please enter customer Name.`;
    }
});

// After modal is closed page will get reloaded
$('#bookingModal').on('hidden.bs.modal', function (e) {
    document.location.reload();
});

(function init() {
    populateCardHead();
})();

function populateCardHead() {
    const invoiceData = JSON.parse(localStorage.invoiceData);
    const itemAndHallRows = [];
    let subTotal = 0;

    /**
     * Class for row blueprint
     */
    class ItemRows {
        constructor(id,item,unitcost,qty,total) {
            this.id = id;
            this.item = item;
            this.unitcost =unitcost;
            this.qty = qty;
            this.total = total;
        }
    }

    const allItems = invoiceData.items.split(','); //items:"Pillow:1:50,Bed-Sheet:2:100,Table:1:100,Zazim:1:60"
    const hallData = invoiceData.halls.split(':');//halls:"Special Hall:70000"

    itemAndHallRows.push(new ItemRows(1, hallData[0], hallData[1], '1', hallData[1]));
    subTotal += parseInt(hallData[1]);

    let idCount = 2;
    allItems.forEach(e => {
        const details = e.split(':');
        const total =  parseInt(details[1]) * parseInt(details[2]);
        itemAndHallRows.push(new ItemRows(idCount, details[0], details[2], details[1], total));
        subTotal += parseInt(total);
        idCount++;
    });
    
    const cardHeadDOM = document.getElementById('card-head');
    const customerDOM = document.getElementById('cust_name');
    const custMailDOM = document.getElementById('cust_mail');
    const custPhoneDOM = document.getElementById('cust_phone');
    const custAddressDOM = document.getElementById('cust_address');
    const custItemsRow = document.getElementById('invoice_items');
    const custPriceRow = document.getElementById('invoice_calc');

    cardHeadDOM.innerHTML = `<strong>Date:</strong> ${invoiceData.date}
                            <span class="float-right">
                                <strong>Invoice:</strong> ${invoiceData.invoiceNum}
                                <code> | </code>
                                <strong>Payment:</strong> ${invoiceData.payStatus}
                            </span>`;
    
    customerDOM.innerHTML = `<strong>${invoiceData.customer}</strong>`;

    custAddressDOM.innerHTML = `🏠 ${invoiceData.address}`;
    custMailDOM.innerHTML = `📧 ${invoiceData.mail}`;
    custPhoneDOM.innerHTML = `📞 ${invoiceData.phone}`;

    itemAndHallRows.forEach(item=>{
        console.log(item.item);
        const row = `<tr>
                        <td class="center">${item.id}</td>
                        <td class="left strong">${item.item}</td>
                        <td class="right">Rs.${item.unitcost}</td>
                        <td class="center">${item.qty}</td>
                        <td class="right">Rs.${item.total}</td>
                    </tr>`;
        custItemsRow.insertAdjacentHTML('beforeEnd', row);
    });

    const netTotal = (subTotal + parseInt(invoiceData.damage) + parseInt(invoiceData.gst) + parseInt(invoiceData.serviceTax)) - parseInt(invoiceData.paid);
    custPriceRow.innerHTML = `<tr>
                                <td class="left">
                                    <strong>Subtotal</strong>
                                </td>
                                <td class="right" id="subtotal">${subTotal}</td>
                            </tr>
                            <tr>
                                <td class="left">
                                    <strong>Damage</strong>
                                </td>
                                <td class="right" id="damage">${invoiceData.damage}</td>
                            </tr>
                            <tr>
                                <td class="left">
                                    <strong>GST</strong>
                                </td>
                                <td class="right" id="gst">${invoiceData.gst}</td>
                            </tr>
                            <tr>
                                <td class="left">
                                    <strong>Serv. Tax</strong>
                                </td>
                                <td class="right" id="stax">${invoiceData.serviceTax}</td>
                            </tr>
                            <tr>
                                <td class="left">
                                    <strong>Paid (-)</strong>
                                </td>
                                <td class="right" id="paid">${invoiceData.paid}</td>
                            </tr>
                            <tr>
                                <td class="left">
                                    <strong>Total</strong>
                                </td>
                                <td class="right">
                                    <strong>${netTotal}</strong>
                                </td>
                            </tr>`;

}
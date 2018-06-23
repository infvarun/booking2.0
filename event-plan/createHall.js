const HALL_ID = document.getElementById('hall_id');
const HALL_NAME = document.getElementById('hall_name');

function hallFormSubmit() {
    const formObj = {};
    const hallID = generateUniqueID('H');
    const hallName = HALL_NAME.value;
    const hallRadio = document.querySelector('input[name="hallRadio"]:checked').value;
    const hallCooling = document.querySelector('input[name="hallCooling"]:checked').value;
    const hallCap = document.getElementById('hall_cap').value;
    const hallPrice = document.getElementById('hall_price').value;
    const hallDesc = document.getElementById('hall_desc').value;

    formObj.hallid = hallID;
    formObj.name = hallName;
    formObj.status = hallRadio;
    formObj.type = hallCooling;
    formObj.description = hallDesc;
    formObj.capacity = hallCap;
    formObj.price = hallPrice;
    //console.log(JSON.stringify(formObj));
    return (hallName) ? JSON.stringify(formObj) : false;
}

// Event handler for hall save 
const saveHallDOM = document.getElementById('save_hall');
saveHallDOM.addEventListener('click', ()=>{
    const formString = hallFormSubmit();
    
    if(formString) {
        const formObj = JSON.parse(formString);
        axios.post('http://localhost:8080/deo-api/public/hall', formObj)
        .then(function(response){
            console.log('saved successfully')
        });
        saveHallDOM.style.display = 'none';
        document.getElementById('hall_modal_body').innerHTML = `
            <div class="card border-success mb-3" id="hall_success" style="max-width: 18rem; margin-right:auto; margin-left:auto;">
                <div class="card-header">
                    <h3 style="text-align:center; color: rgba(5, 102, 5, 0.74)">Hall created successfully!!</h3>
                </div>
                <div class="card-body text-success">
                    <h5 class="card-title text-warning">${formObj.name}</h5>
                    <div class="card-text">
                        <table class="table table-sm">
                            <thead class="text-warning">
                                <tr>
                                    <th scope="col">Price</th>
                                    <th scope="col">${formObj.price}</th>
                                </tr>
                                <tr>
                                    <th scope="col">Cooling</th>
                                    <th scope="col">${formObj.type}</th>
                                </tr>
                                <tr>
                                    <th scope="col">Capacity</th>
                                    <th scope="col">${formObj.capacity}</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>`;
        setTimeout(()=>{
            $('#hall_success').addClass('animated jackInTheBox');
        }, 100);
    } else {
        HALL_NAME.style.borderColor = '#dc3545';
        HALL_NAME.focus();
        document.getElementById('hall_name_error').innerHTML = `<i class="fas fa-exclamation-circle"></i> Please enter Hall Name.`;
    }
});

// After modal is closed page will get reloaded
$('#hallModal').on('hidden.bs.modal', function (e) {
    document.location.reload();
});



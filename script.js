(function (mobx, $) {

    const myName = mobx.observable({
        first: 'Eric',
        last: 'Falchier',
        fullName: function () {
            return `${this.first} ${this.last}`;
        }
    });

    mobx.autorun(function () {
        $('#tb-firstName').val(myName.first);
    })

    mobx.autorun(function () {
        $('#name').text(myName.fullName());
    });

    $('#tb-firstName').on('keyup', function() {
        myName.first = $(this).val();
    });
    
    const createLoan = new Loan({});
    const myLoan = mobx.observable(createLoan); 
    
    function Loan(obj) {
        mobx.extendObservable(this, {
            loanAmount: obj.loanAmount || 0,
            rate: obj.rate || 5.1,
            term: obj.term || 30
        })
    }
    
    Loan.prototype.monthlyPayment = function () {
        var loanAmt = this.loanAmount;
        var totalMonths = this.term * 12;
        var monthlyRate = (this.rate / 100) / 12;
        return loanAmt * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }
    
    mobx.autorun(function () {
        const loan = myLoan;
        $('#tb-loanAmount').val(loan.loanAmount);
        $('#tb-rate').val(loan.rate);
        $('#tb-term').val(loan.term);
    });

    mobx.autorun(function() {
        const target = $('#mp');
        const mp = myLoan.monthlyPayment();
        
        if(isNaN(mp)) {
            target.text("Fill out all inputs to see your results");
        } else {
            target.text(mp);
        }
    });
    
    $('#tb-loanAmount').on('keyup', function() {
        myLoan.loanAmount = parseFloat($(this).val()) || 0;
    });
    
    $('#tb-rate').on('keyup', function() {
        myLoan.rate = parseFloat($(this).val()) || 0; 
    });
    
    $('#tb-term').on('keyup', function() {
        myLoan.term = parseFloat($(this).val()) || 0;
    });

})(mobx, $); 
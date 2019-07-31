(function (mobx, $) {

    //MobX 4 runs on any ES5 browser and will be actively maintained. 
    //The MobX 4 and 5 api's are the same and 
    //semantically can achieve the same, 
    //but MobX 4 has some limitations.

    //Name & Bitcoin

    const me = mobx.observable({
        first: 'Eric',
        last: 'Falchier',
        myBitcoin: 4,
        bitcoinPrice: 0,
        bitcoinLoading: true,
        get fullName () {
            console.log('Watch me only print once!')
            return `${this.first} ${this.last}`;
        },
        get myBitcoinValue () {
            console.log(this.myBitcoin, this.bitcoinPrice)
            return this.myBitcoin * this.bitcoinPrice;
        },
        fetchBitcoinPrice: mobx.action(function() {
            fetch('https://api.coindesk.com/v1/bpi/currentprice.json', {
                method: 'get',
            })
            .then(resp => resp.json())
            .then(data => {
                this.bitcoinLoading = false;
                this.bitcoinPrice = data.bpi.USD.rate_float;
            });
        })
    }); 
    
    setInterval(function () {
        me.fetchBitcoinPrice();
    }, 10000);

    mobx.autorun(function () {
        $('#tb-firstName').val(me.first);
    })

    mobx.autorun(function () {
        $('#name').text(me.fullName);
    });

    mobx.autorun(function () {
        if(me.bitcoinLoading) {
            return false;
        } else {
            $('#bc-val').text(me.myBitcoinValue);
        }
    });


    //computed
    setInterval(function () {
        console.log(me.fullName)
    }, 1000)

    $('#tb-firstName').on('keyup', function() {
        me.first = $(this).val();
    });


    //Loan
    
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
const { json } = require('body-parser');
const request = require('request');
const user = require('../models/User');
exports.postSignUp=(req,res,next)=>{
    const fname = req.body['fName'];
    const lname = req.body['lName'];
    const email = req.body['email'];
    const cNum = req.body['cNum'];
    const conPass = req.body['conPass'];
    const oriPass = req.body['oriPass'];
    const User = new user({
        fname:fname,
        lname:lname,
        email:email,
        contact: cNum,
        password: conPass
    })
    User
    .save()  
    .then(result =>{console.log('Account created');
        res.redirect('/login/user?signup=true&logout=false')})
    .catch(err=>{
        if(err.code === 11000)
        {
            res.render('unauthorized/signup',{title:'Signup',duplicate:true,userType:'unauthorized'})
        }
        console.log(err);
    }) 
}
exports.getSignUp=(req,res,next)=>{
    
    res.render('unauthorized/signup',{title:'Signup',userType:'unauthorized',duplicate:false});
}
exports.getLogin=(req,res,next)=>{
    if(req.session.loggedin)
    {
        return res.redirect('/authorized/logout');
    }
    res.render('unauthorized/login',{title:'Login',accountLogout:false,accountCreated:false,userType:'unauthorized',isAuthenticated:'false'});
}
exports.accActivity=(req,res,next)=>{
    if(req.session.loggedin)
    {
        return res.redirect('/authorized/logout');
    }
    const loggedOut = req.query.logout;
    const accCreated = req.query.signup;
    if(loggedOut==='true')
    {
        res.render('unauthorized/login',{title:'Login',accountLogout:true,accountCreated:false,userType:'unauthorized',isAuthenticated:'false'});
    }
    if(accCreated==='true')
    {
    res.render('unauthorized/login',{title:'Login',accountLogout:false,accountCreated:true,userType:'unauthorized',isAuthenticated:'false'});
    }
}
exports.accLogout=(req,res,next)=>{
    
}
exports.postLogin=(req,res,next)=>{
    const email = req.body['email'];
    const pass = req.body['pass'];
    user.findOne({email:email,password:pass})
    .then(u=>{
        if(u == null)
        {
            res.render('unauthorized/login',{title:'Login',accountLogout:false,accountCreated:false,userType:'unauthorized',isAuthenticated:'true'});
        }
        else
        {
            
            req.session.loggedin = true;
            req.session.ID =u.id;
            req.session.email = email;
            req.session.name = u.fname.toUpperCase()+' '+u.lname.toUpperCase();
            res.setHeader("Cache-control", "no-store, must-revalidate, private,no-cache");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
            res.redirect('/authorized');
        }
    })
    .catch(err=>{
        console.log(err);
    })
}
exports.getHome=(req,res,next)=>{
    if(req.session.loggedin)
    {
        return res.redirect('/authorized/logout');
    }
    const date = new Date().toISOString().slice(0,10);
    const from = 'USD';
    const to = 'INR';
    const amt =1;
    var fdt = new Date(date.slice(0,4),date.slice(5,7)-1,date.slice(8,10));
    fdt.setDate(fdt.getDate() - 3 );
     const fromDate = new Date(fdt).toISOString().slice(0, 10);
    
     var tdt = new Date(date.slice(0,4),date.slice(5,7)-1,date.slice(8,10));
     tdt.setDate(tdt.getDate() + 3 );
     const toDate = new Date(tdt).toISOString().slice(0,10);
    
    request({
        url:'https://api.exchangerate.host/timeseries?start_date='+fromDate+'&end_date='+toDate+'&base='+from+'&symbols='+to+'&amount='+amt,
        json: true
      },(err,response,body)=>{
         getData(body);
      }
      );
      const getData = (cb)=>{
        const formatedDate=date.slice(8,10)+'-'+date.slice(5,7)+'-'+date.slice(0,4);
        const data=[];
        data.push(date);
        data.push(from);
        data.push(to);
        data.push(amt);
        const dates =[];
        const rates = [];
        for(let i in cb.rates)
        {
            
            rates.push(cb.rates[i][to]);
            i=i.slice(8,10)+'-'+i.slice(5,7)+'-'+i.slice(0,4)
            
            dates.push(i);
        }

        data.push(dates);
        data.push(rates);
        data.push(cb.rates[date][to]);
        data.push(formatedDate);
        res.render('home',{title:'Home',userType:'unauthorized',from:data[1],to:data[2],froVal:data[3],toVal:data[6],date:data[0],formatedDate:data[7],rates:data[5],dates:data[4]});
        }
    }
exports.postHome=(req,res,next)=>{
    const from =req.body['from'];
    const to = req.body['to'];
    const amt = req.body['val'];
    const date = req.body['date'];
    const formatedDate=date.slice(8,10)+'-'+date.slice(5,7)+'-'+date.slice(0,4);
    var fdt = new Date(date.slice(0,4),date.slice(5,7)-1,date.slice(8,10));
    fdt.setDate(fdt.getDate() - 3 );
     const fromDate = new Date(fdt).toISOString().slice(0, 10);
    
     var tdt = new Date(date.slice(0,4),date.slice(5,7)-1,date.slice(8,10));
     tdt.setDate(tdt.getDate() + 3 );
     const toDate = new Date(tdt).toISOString().slice(0,10);
    
    request({
        url:'https://api.exchangerate.host/timeseries?start_date='+fromDate+'&end_date='+toDate+'&base='+from+'&symbols='+to+'&amount='+amt,
        json: true
      },(err,response,body)=>{
         getData(body);
      }
      );
      const getData = (cb)=>{
        const data =[];
        data.push(date);
        data.push(from);
        data.push(to);
        data.push(amt);
        const dates =[];
        const rates = [];
        for(let i in cb.rates)
        {
            rates.push(cb.rates[i][to]);
            i=i.slice(8,10)+'-'+i.slice(5,7)+'-'+i.slice(0,4)
            
            dates.push(i);
        }

        data.push(dates);
        data.push(rates);
        data.push(cb.rates[date][to]);
    
        res.render('home',{title:'Home',userType:'unauthorized',from:data[1],to:data[2],froVal:data[3],toVal:data[6],formatedDate:formatedDate,date:data[0],rates:data[5],dates:data[4]});
     }
}

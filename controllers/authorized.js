const { json } = require('body-parser');
const { response } = require('express');
const request = require('request');
const user = require('../models/User');
const savedSearches = require('../models/savedData');
exports.getHome=(req,res,next)=>{
   if(!req.session.loggedin){
      res.redirect('/');
   }
   else{
   const email = req.session.email;
   
   const date = new Date().toISOString().slice(0,10);
   const formatedDate=date.slice(8,10)+'-'+date.slice(5,7)+'-'+date.slice(0,4)
   const from = 'USD';
   const to = 'INR';
   const amt =1;
   const name =req.session.name;
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
       data.push(date.slice(8,10)+'-'+data.slice(5,7)+'-'+date.slice(0,4));
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
       const toVal = cb.rates[date][to];
       data.push(toVal);
       res.setHeader("Cache-control", "no-store, must-revalidate, private,no-cache");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
       res.render('home',{title:'Home',searchSaved:false,userType:'authorized',from:data[1],to:data[2],froVal:data[3],toVal:data[6],date:date,formatedDate:formatedDate,rates:data[5],dates:data[4],name:name});      
       }
      }
}
exports.postHome=(req,res,next)=>{
   if(!req.session.loggedin){
      res.redirect('/');
   }
   else{
   const name = req.session.name;
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
       res.render('home',{title:'Home',searchSaved:false,userType:'authorized',name:name,from:data[1],to:data[2],froVal:data[3],toVal:data[6],formatedDate:formatedDate,date:data[0],rates:data[5],dates:data[4]});
    }
   }
}
exports.logout=(req,res,next)=>{
   if(req.session.loggedin)
   {
      res.setHeader("Cache-control", "no-store, must-revalidate, private,no-cache");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
   req.session.destroy((err)=>{
      if(err)
      {
       console.log(err);
      }
      res.redirect('/login/user?signup=false&logout=true');
   });
   }
   else{
      res.redirect('/');
   }
}
exports.saved=(req,res,next)=>{
   if(!req.session.loggedin){
      res.redirect('/');
   }
   else{
      const name = req.session.name
         savedSearches.find({uId:req.session.ID})
         .then(out=>{
       res.setHeader("Cache-control", "no-store, must-revalidate, private,no-cache");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
       res.render('authorized/saved',{title:'Saved searches',data:out,userType:'authorized',name:name});
         
      })
      
      
    
   }
}
exports.searches = (req,res,next)=>{
   if(!req.session.loggedin){
      res.redirect('/');
   }
   const name = req.session.name;
   const from =req.body['from'];
   const to = req.body['to'];
   const froVal = req.body['froVal'];
   const toVal = req.body['toVal'];
   const date = req.body['date'];
   const formatedDate=date.slice(8,10)+'-'+date.slice(5,7)+'-'+date.slice(0,4);
   var fdt = new Date(date.slice(0,4),date.slice(5,7)-1,date.slice(8,10));
   fdt.setDate(fdt.getDate() - 3 );
    const fromDate = new Date(fdt).toISOString().slice(0, 10);
    var tdt = new Date(date.slice(0,4),date.slice(5,7)-1,date.slice(8,10));
    tdt.setDate(tdt.getDate() + 3 );
    const toDate = new Date(tdt).toISOString().slice(0,10);
   const search = new savedSearches(
      {
         uId : req.session.ID,
         date:formatedDate,
         fromCur:from,
         toCur:to,
         fromVal:froVal,
         toVal:toVal
      }
   )
   .save()
   .then(
      result =>{
      console.log(result);   
      console.log('Search saved!!');
   request({
       url:'https://api.exchangerate.host/timeseries?start_date='+fromDate+'&end_date='+toDate+'&base='+from+'&symbols='+to+'&amount='+froVal,
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
       data.push(froVal);
       const dates =[];
       const rates = [];
       for(let i in cb.rates)
       {
           rates.push(cb.rates[i][to]);
           i=i.slice(8,10)+'-'+i.slice(5,7)+'-'+i.slice(0,4);
            dates.push(i);
       }

       data.push(dates);
       data.push(rates);
       data.push(cb.rates[date][to]);
       res.render('home',{title:'Home',searchSaved:true,userType:'authorized',name:name,from:data[1],to:data[2],froVal:data[3],toVal:data[6],formatedDate:formatedDate,date:data[0],rates:data[5],dates:data[4]});
   }
 }
   )
   .catch(err=>{
      console.log(err);
   })

   
}
exports.deleteSearch=(req,res,next)=>{
   const id = req.body['id'];
   savedSearches.findByIdAndDelete(id).then(
      result =>{
         res.redirect('/authorized/saved');
      }
   )
   .catch(err=>{
      console.log(err);
   })
}

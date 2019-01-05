const coreDB = require('qaq-core-db');
var oracledb = require("oracledb");
const coreUtil = require('qaq-core-util');
var async = require("async");

exports.register = function(req,res,tpoolconn,redirectParam,callback) { 
    let coIdn = redirectParam.coIdn;
    let applIdn = redirectParam.applIdn;
    let source = redirectParam.source || req.body.source;

    let name = req.body.name || '';

    let outJson = {};
    let params=[];
    let fmt = {};

    if(name !=''){
        let methodParam = {};
        methodParam["name"]=name;
        execCheckUserExist(methodParam,tpoolconn).then(userExist =>{
            if(userExist.status=="SUCCESS" && userExist.message=="SUCCESS"){  

                let insertBuzzerQ="insert into buzzer_user(nme) \n" +
                "values(lower($1)) RETURNING user_idn";
            
                params.push(name);
            
                // console.log(insertTransactionQ);
                // console.log(params);
                coreDB.executeTransSql(tpoolconn,insertBuzzerQ,params,fmt,function(error,result){
                    if(error){
                        coreDB.doTransRollBack(tpoolconn);
                        outJson["status"]="FAIL";
                        outJson["message"]="Error In insertBuzzerQ Method!"+error.message;
                        callback(null,outJson);
                    }else{
                        coreDB.doTransCommit(tpoolconn);
                        var rowCount = result.rowCount;
                        if(rowCount>0){
                            var resultRow=result.rows[0] || {};
                            outJson["userIdn"]=resultRow["user_idn"];
                            outJson["status"]="SUCCESS";
                            outJson["message"]="Buzzer User Inserted Sucessfully!";
                        }else{
                            coreDB.doTransRollBack(tpoolconn);
                            outJson["status"]="FAIL";
                            outJson["message"]="Buzzer User Inserted Failed!";
                        }
                        callback(null,outJson);
                    }
                });
            }else{
            callback(null,userExist);
            } 
        }) 
    }else if(name ==''){
        outJson["result"]=resultFinal;
        outJson["status"]="FAIL";
        outJson["message"]="Please Verify Name Can not be blank!";
        callback(null,outJson);
    }
} 

function execCheckUserExist(methodParam,tpoolconn){
    return new Promise(function(resolve,reject) {
        checkUserExist(methodParam,tpoolconn, function (error, result) {
        if(error){  
          reject(error);
         }
        resolve(result);
     });
    });
}

function checkUserExist(methodParam,tpoolconn,callback) {
    let name = methodParam.name;
    
    let fmt = {};
    let params=[];
    let outJson = {};

    var sql="select user_idn from buzzer_user where lower(nme) =lower($1)";
    params.push(name);
 
    //console.log(sql);
    //console.log(params);
    coreDB.executeTransSql(tpoolconn,sql,params,fmt,function(error,result){
        if(error){
            outJson["status"]="FAIL";
            outJson["message"]="Error In checkUserExist Method!";
            callback(null,outJson);
        }else{
            var len=result.rows.length;
            //console.log(len)
            if(len>0){
                var resultRow=result.rows[0] || {};
                outJson["userIdn"]=resultRow["user_idn"];
                outJson["status"]="SUCCESS";
                outJson["message"]="User Already Exist";
            }else{
                outJson["status"]="SUCCESS";
                outJson["message"]="SUCCESS";
            }
            callback(null,outJson);
        }
    })
}

exports.saveQuestions = function(req,res,tpoolconn,redirectParam,callback) { 
    let coIdn = redirectParam.coIdn;
    let applIdn = redirectParam.applIdn;
    let source = redirectParam.source || req.body.source;

    let roundName = req.body.roundName || '';
    let roundSrl = req.body.roundSrl || '';
    let qType = req.body.qType || '';
    let qCtg = req.body.qCtg || '';
    let qDifficulty = req.body.qDifficulty || '';
    let question = req.body.question || '';
    let ans = req.body.ans || '';
    let options = req.body.options || [];
    let plusPts = req.body.plusPts || '';
    let minusPts = req.body.minusPts || '';

    let outJson = {};
    let resultFinal = {};

    if(roundName !='' && roundSrl !='' && qType !='' && qCtg !='' && qDifficulty !='' && question !='' && ans !='' && plusPts !='' && minusPts !=''){
        let params=[];
        let fmt = {};
        let insertBuzzerSrlQ="insert into buzzer_srl(round_nme,round_srl,q_typ,q_ctg,q_difficulty,question,answer,options,plus_pts,minus_pts,status,start_ts) \n" +
        "values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,current_timestamp) RETURNING srl";
    
        params.push(roundName);
        params.push(roundSrl);
        params.push(qType);
        params.push(qCtg);
        params.push(qDifficulty);
        params.push(question);
        params.push(ans);
        params.push(options);
        params.push(plusPts);
        params.push(minusPts);
        params.push("1");
        
        // console.log(insertTransactionQ);
        // console.log(params);
        coreDB.executeTransSql(tpoolconn,insertBuzzerSrlQ,params,fmt,function(error,result){
            if(error){
                coreDB.doTransRollBack(tpoolconn);
                outJson["status"]="FAIL";
                outJson["message"]="Error In insertBuzzerSrlQ Method!"+error.message;
                callback(null,outJson);
            }else{
                coreDB.doTransCommit(tpoolconn);
                var rowCount = result.rowCount;
                if(rowCount>0){
                    var resultRow=result.rows[0] || {};
                    outJson["buzzerSrlIdn"]=resultRow["srl"];
                    outJson["status"]="SUCCESS";
                    outJson["message"]="BuzzerSrl Inserted Sucessfully!";
                }else{
                    coreDB.doTransRollBack(tpoolconn);
                    outJson["status"]="FAIL";
                    outJson["message"]="BuzzerSrl Inserted Failed!";
                }
                callback(null,outJson);
            }
        });  
    }else if(roundName ==''){
        outJson["result"]=resultFinal;
        outJson["status"]="FAIL";
        outJson["message"]="Please Verify Round Name Can not be blank!";
        callback(null,outJson);
    } else if(roundSrl ==''){
        outJson["result"]=resultFinal;
        outJson["status"]="FAIL";
        outJson["message"]="Please Verify Round Serial Can not be blank!";
        callback(null,outJson);
    } else if(qType ==''){
        outJson["result"]=resultFinal;
        outJson["status"]="FAIL";
        outJson["message"]="Please Verify Question Type Can not be blank!";
        callback(null,outJson);
    } else if(qCtg ==''){
        outJson["result"]=resultFinal;
        outJson["status"]="FAIL";
        outJson["message"]="Please Verify Question Category Can not be blank!";
        callback(null,outJson);
    } else if(qDifficulty ==''){
        outJson["result"]=resultFinal;
        outJson["status"]="FAIL";
        outJson["message"]="Please Verify Question Difficulty Can not be blank!";
        callback(null,outJson);
    } else if(question ==''){
        outJson["result"]=resultFinal;
        outJson["status"]="FAIL";
        outJson["message"]="Please Verify Question Can not be blank!";
        callback(null,outJson);
    } else if(ans ==''){
        outJson["result"]=resultFinal;
        outJson["status"]="FAIL";
        outJson["message"]="Please Verify Answer Can not be blank!";
        callback(null,outJson);
    } else if(plusPts ==''){
        outJson["result"]=resultFinal;
        outJson["status"]="FAIL";
        outJson["message"]="Please Verify Plus Points Can not be blank!";
        callback(null,outJson);
    } else if(minusPts ==''){
        outJson["result"]=resultFinal;
        outJson["status"]="FAIL";
        outJson["message"]="Please Verify Minus Points Can not be blank!";
        callback(null,outJson);
    }
} 

exports.getRoundDetailsWithUserList =async function(req,res,tpoolconn,redirectParam,callback) { 
    let coIdn = redirectParam.coIdn;
    let applIdn = redirectParam.applIdn;
    let source = redirectParam.source || req.body.source;

    let outJson = {};
    let params=[];
    let fmt = {};
    let resultFinal = {};

    var methodParam = {};
    let userDetails = await execGetUserList(methodParam,tpoolconn);                  
        if(userDetails["status"] == 'SUCCESS')
            resultFinal["userList"] = userDetails["userIdnList"] || [];  
        else
            resultFinal["userList"] = [];  


    let sql="select srl,round_nme,q_ctg,round_srl from buzzer_srl where end_ts is null order by q_ctg ";

    // console.log(insertTransactionQ);
    // console.log(params);
    coreDB.executeTransSql(tpoolconn,sql,params,fmt,function(error,result){
        if(error){
            outJson["status"]="FAIL";
            outJson["message"]="Error In get Round Details Method!"+error.message;
            callback(null,outJson);
        }else{
            var len = result.rows.length;
            if(len>0){
                var prvRdNme = '';
                var list = [];
                var map = {};
                for(var i=0;i<len;i++){
                    var resultRows = result.rows[i];
                    var rdNme = resultRows["round_nme"];

                    if(prvRdNme == '')
                        prvRdNme = rdNme;

                    if(prvRdNme != rdNme){
                        map[prvRdNme] = list;
                        prvRdNme = rdNme;
                        list = [];
                    }

                    var rmap = {};
                    rmap["srl"] = resultRows["srl"];
                    rmap["roundSrl"] = resultRows["round_srl"]; 
                    //rmap["round_nme"] = resultRows["round_nme"];
                    list.push(rmap);
                }
                map[prvRdNme] = list;

                resultFinal["roundDetails"]=map;
                outJson["result"]=resultFinal;
                outJson["status"]="SUCCESS";
                outJson["message"]="SUCCESS";
            }else{
                outJson["status"]="FAIL";
                outJson["message"]="Sorry no result found";
            }
            callback(null,outJson);
        }
    })
} 

function execGetUserList(methodParam,tpoolconn){
    return new Promise(function(resolve,reject) {
        getUserList(methodParam,tpoolconn, function (error, result) {
        if(error){  
          reject(error);
         }
        resolve(result);
     });
    });
}

function getUserList(methodParam,tpoolconn,callback) {    
    let fmt = {};
    let params=[];
    let outJson = {};

    var sql="select user_idn,nme from buzzer_user";
 
    //console.log(sql);
    //console.log(params);
    coreDB.executeTransSql(tpoolconn,sql,params,fmt,function(error,result){
        if(error){
            outJson["status"]="FAIL";
            outJson["message"]="Error In getUserList Method!";
            callback(null,outJson);
        }else{
            var len=result.rows.length;
            //console.log(len)
            if(len>0){
                var list = [];
                for(var i=0;i<len;i++){
                    var resultRow=result.rows[i];
                    var map={};
                    var nme = resultRow["nme"];
                    var user_idn = resultRow["user_idn"];
                    map["userIdn"] =user_idn;
                    map["userNme"] =nme;
                    list.push(map);
                }

                outJson["userIdnList"]=list;
                outJson["status"]="SUCCESS";
                outJson["message"]="SUCCESS";
            }else{
                outJson["status"]="Fail";
                outJson["message"]="Sorry no result found";
            }
            callback(null,outJson);
        }
    })
}

exports.getRoundDetails = function(req,res,tpoolconn,redirectParam,callback) { 
    let coIdn = redirectParam.coIdn;
    let applIdn = redirectParam.applIdn;
    let source = redirectParam.source || req.body.source;

    let outJson = {};
    let params=[];
    let fmt = {};
    let resultFinal = {};

    let sql="select srl,round_nme,round_srl,question,answer,q_typ,q_ctg,plus_pts,minus_pts from buzzer_srl where end_ts is null ";

    // console.log(insertTransactionQ);
    // console.log(params);
    coreDB.executeTransSql(tpoolconn,sql,params,fmt,function(error,result){
        if(error){
            outJson["status"]="FAIL";
            outJson["message"]="Error In get Round Details Method!"+error.message;
            callback(null,outJson);
        }else{
            var len = result.rows.length;
            if(len>0){
                var list = [];
                for(var i=0;i<len;i++){
                    var map = {};
                    var resultRows = result.rows[i];
                    map["srl"] = resultRows["srl"] || '';
                    map["roundName"] = resultRows["round_nme"] || '';
                    map["roundSrl"] =  resultRows["round_srl"] || '';
                    map["question"] = resultRows["question"] || '';
                    map["answer"] =  resultRows["answer"] || '';
                    map["qType"] = resultRows["q_typ"] || '';
                    map["qCtg"] =  resultRows["q_ctg"] || '';
                    map["plusPoints"] = resultRows["plus_pts"] || '';
                    map["minusPoints"] =  resultRows["minus_pts"] || '';
                    list.push(map);
                }

                resultFinal["roundDetails"]=list;
                outJson["result"]=resultFinal;
                outJson["status"]="SUCCESS";
                outJson["message"]="SUCCESS";
            }else{
                outJson["status"]="FAIL";
                outJson["message"]="Sorry no result found";
            }
            callback(null,outJson);
        }
    })
} 

exports.setRoundActive = function(req,res,tpoolconn,redirectParam,callback) { 
    let coIdn = redirectParam.coIdn;
    let applIdn = redirectParam.applIdn;
    let source = redirectParam.source || req.body.source;

    let srl = req.body.srl || '';

    let outJson = {};
    let params=[];
    let fmt = {};
    let resultFinal = {};

    if(srl != ''){
        let sql="update buzzer_srl set status = 0,start_ts = null where status = 1 and end_ts is null";

        coreDB.executeTransSql(tpoolconn,sql,params,fmt,function(error,result){
            if(error){
                coreDB.doTransRollBack(tpoolconn);
                outJson["status"]="FAIL";
                outJson["message"]="Error In update previous active Round Method!"+error.message;
                callback(null,outJson);
            }else{
                let sql="update buzzer_srl set status = 1,start_ts=current_timestamp where srl = $1 and status = 0 and end_ts is null";
                params=[];
                params.push(srl);
                coreDB.executeTransSql(tpoolconn,sql,params,fmt,function(error,result){
                    if(error){
                        coreDB.doTransRollBack(tpoolconn);
                        outJson["status"]="FAIL";
                        outJson["message"]="Error In update active Round Method!"+error.message;
                        callback(null,outJson);
                    }else{
                        var len = result.rowCount;                    
                        coreDB.doTransCommit(tpoolconn);
                        if(len > 0){
                            outJson["result"]=resultFinal;
                            outJson["status"]="SUCCESS";
                            outJson["message"]="Round Active Successfully";
                        }else{
                            coreDB.doTransRollBack(tpoolconn);
                            outJson["result"]=resultFinal;
                            outJson["status"]="FAIL";
                            outJson["message"]="Round Active Failed";
                        }
                        callback(null,outJson);
                    }
                })
            }
        })
    } else if (srl == '') {
        outJson["result"] = resultFinal;
        outJson["status"] = "FAIL";
        outJson["message"] = "Please Verify Srl Can not be blank!";
        callback(null, outJson);
    }  
} 

exports.updateRoundPoints = async function(req,res,tpoolconn,redirectParam,callback) { 
    let coIdn = redirectParam.coIdn;
    let applIdn = redirectParam.applIdn;
    let source = redirectParam.source || req.body.source;

    let srl = req.body.srl || '';
    let plusUserIdn = req.body.plusUserIdn || '';
    let minusUserIdn = req.body.minusUserIdn || '';

    let outJson = {};
    let params=[];
    let fmt = {};
    let methodParam = {};
    let sql = "";
    let resultFinal = {};

    if(srl != '' && (plusUserIdn != '' || minusUserIdn != '')){
        methodParam["srl"] = srl;
        methodParam["plusUserIdn"] = plusUserIdn;
        let plusPoints = await execUpdatePoints(methodParam,tpoolconn);

        methodParam = {};
        methodParam["srl"] = srl;
        methodParam["minusUserIdn"] = minusUserIdn;
        let minusPoints = await execUpdatePoints(methodParam,tpoolconn);

        let sql="update buzzer_srl set status = 2,end_ts=current_timestamp where srl = $1 and status = 1 and end_ts is null";
        params=[];
        params.push(srl);
        coreDB.executeTransSql(tpoolconn,sql,params,fmt,function(error,result){
            if(error){
                coreDB.doTransRollBack(tpoolconn);
                outJson["status"]="FAIL";
                outJson["message"]="Error In update buzzer_srl Method!"+error.message;
                callback(null,outJson);
            }else{
                var len = result.rowCount;                    
                coreDB.doTransCommit(tpoolconn);
                if(len > 0){
                    outJson["result"]=resultFinal;
                    outJson["status"]="SUCCESS";
                    outJson["message"]="Round Points Save Successfully";
                }else{
                    coreDB.doTransRollBack(tpoolconn);
                    outJson["result"]=resultFinal;
                    outJson["status"]="FAIL";
                    outJson["message"]="Round Points Save Failed";
                }
                callback(null,outJson);
            }
        })
    } else if (srl == '') {
        outJson["result"] = resultFinal;
        outJson["status"] = "FAIL";
        outJson["message"] = "Please Verify srl Can not be blank!";
        callback(null, outJson);
    } else if (plusUserIdn == '' || minusUserIdn == '') {
        outJson["result"] = resultFinal;
        outJson["status"] = "FAIL";
        outJson["message"] = "Please Verify plusUserIdn/minusUserIdn Can not be blank!";
        callback(null, outJson);
    }  
} 

function execUpdatePoints(methodParam,tpoolconn){
    return new Promise(function(resolve,reject) {
        updatePoints(methodParam,tpoolconn, function (error, result) {
        if(error){  
          reject(error);
         }
        resolve(result);
     });
    });
}

function updatePoints(methodParam,tpoolconn,callback) {    
    let fmt = {};
    let params=[];
    let outJson = {};
    let plusUserIdn = methodParam.plusUserIdn || '';
    let minusUserIdn = methodParam.minusUserIdn || '';
    let srl = methodParam.srl || '';

    var sql = "";
    if(plusUserIdn != ''){
        sql="update buzzer_srl set plus_user_idn= $1 where srl = $2 "+
            " and status=1 and end_ts is null";
            params=[];
            params.push(plusUserIdn);
            params.push(srl);
    }
    if(minusUserIdn != ''){
        sql="update buzzer_srl set minus_user_idn =  minus_user_idn || '{"+minusUserIdn+"}' where  "+
            " srl=$1 and status=1 and end_ts is null ";
            //"and NOT ($3 = ANY(minus_user_idn)) ";
            params=[]; 
            params.push(srl);
    }
    console.log(sql);
    console.log(params);
    coreDB.executeTransSql(tpoolconn,sql,params,fmt,function(error,result){
        if(error){
            coreDB.doTransRollBack(tpoolconn);
            outJson["status"]="FAIL";
            outJson["message"]="Error In update round points Method!"+error.message;
            callback(null,outJson);
        }else{                
            var len = result.rowCount;                    
            coreDB.doTransCommit(tpoolconn);
            if(len > 0){
                outJson["result"]=resultFinal;
                outJson["status"]="SUCCESS";
                outJson["message"]="Round Points Save Successfully";
            }else{
                coreDB.doTransRollBack(tpoolconn);
                outJson["result"]=resultFinal;
                outJson["status"]="FAIL";
                outJson["message"]="Round Points Save Failed";
            }
            callback(null,outJson);                   
        }
    })
}

exports.buzzerClick = function(req,res,tpoolconn,redirectParam,callback) { 
    let coIdn = redirectParam.coIdn;
    let applIdn = redirectParam.applIdn;
    let source = redirectParam.source || req.body.source;

    let userIdn = req.body.userIdn || '';
    let outJson = {};
    let params=[];
    let fmt = {};
    let resultFinal = {};

    if(userIdn != ''){
        let insertBuzzerQ="insert into buzzer_log(user_idn,log_ts) \n" +
                "values($1,current_timestamp) RETURNING srl  ";
            
        params.push(userIdn);
        coreDB.executeTransSql(tpoolconn,insertBuzzerQ,params,fmt,function(error,result){
            if(error){
                coreDB.doTransRollBack(tpoolconn);
                outJson["status"]="FAIL";
                outJson["message"]="Error In buzzer_log query!"+error.message;
                callback(null,outJson);
            }else{    
                var len = result.rowCount;                    
                coreDB.doTransCommit(tpoolconn);
                if(len > 0){
                    var srl=result.rows[0].srl;
                    console.log(srl)
                    let sql="select min(rank) rnk,min(to_char(log_ts + interval '5.5 hours','dd-MON-yyyy hh24:MI:SS:US')) log_ts "+
                        " from buzzer_log where user_idn=$1 and srl=$2 ";
            
                    params=[];
                    params.push(userIdn);
                    params.push(srl);
                    coreDB.executeTransSql(tpoolconn,sql,params,fmt,function(error,result){
                        if(error){
                            coreDB.doTransRollBack(tpoolconn);
                            outJson["status"]="FAIL";
                            outJson["message"]="Error In buzzer_log query!"+error.message;
                            callback(null,outJson);
                        }else{    
                            var len = result.rows.length;                    
                            if(len > 0){                               
                                resultFinal["rank"]=result.rows[0].rnk;
                                resultFinal["log_ts"] =result.rows[0].log_ts;
                                outJson["result"]=resultFinal;
                                outJson["status"]="SUCCESS";
                                outJson["message"]="Buzzer Log Inserted Successfully";
                            }else{
                                outJson["result"]=resultFinal;
                                outJson["status"]="FAIL";
                                outJson["message"]="Buzzer Log Inserted Failed";
                            }
                            callback(null,outJson); 
                        }
                    }) 
                } else {
                    coreDB.doTransRollBack(tpoolconn);
                    outJson["result"]=resultFinal;
                    outJson["status"]="FAIL";
                    outJson["message"]="Buzzer Log Inserted Failed";
                    callback(null,outJson);                     
                }     
            }
        })
    } else if (userIdn == '') {
        outJson["result"] = resultFinal;
        outJson["status"] = "FAIL";
        outJson["message"] = "Please Verify User Idn Can not be blank!";
        callback(null, outJson);
    }  
}
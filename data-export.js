#! /usr/bin/env node

console.log('This data export is running!!!!');


const async = require('async')
const Actor = require('./models/Actor.js');
const Script = require('./models/Script.js');
const User = require('./models/User.js');
const _ = require('lodash');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs')
var UAParser = require('ua-parser-js');
const util = require('util');

// const dotenv = require("dotenv");

dotenv.config();

var csvWriter = require('csv-write-stream');
var mlm_writer = csvWriter();
//var s_writer = csvWriter();
//var summary_writer = csvWriter();
//5bb3a93ad9fd14471bf3977d
//5bb3a93ad9fd14471bf39791
//5bb3a93ad9fd14471bf39792
//5bb3a93ad9fd14471bf397c8
//var bully_messages = ["5bb3a93ad9fd14471bf3977d",
//"5bb3a93ad9fd14471bf39791",
//"5bb3a93ad9fd14471bf39792",
//"5bb3a93ad9fd14471bf397c8"];
//var bully_stats = [];
//var sur_array = [];

Array.prototype.sum = function() {
    return this.reduce(function(a,b){return a+b;});
};



var mlm_array = [];

// dotenv.load({ path: '.env' });
dotenv.config({ path: '.env' });



/*
var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');


//var connection = mongo.connect('mongodb://127.0.0.1/test');
mongoose.connect(process.env.PRO_MONGODB_URI || process.env.PRO_MONGOLAB_URI);
var db = mongoose.connection;
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
}); */

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;

//mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
//mongoose.connect(process.env.MONGOLAB_TEST || process.env.PRO_MONGOLAB_URI, { useMongoClient: true });
mongoose.connect(process.env.MONGODB_URI || process.env.mongolab_uri_test, { useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});



User.find()
  // .where('active').equals(false)
  .populate({ 
         path: 'feedAction.post',
         model: 'Script',
         populate: {
           path: 'actor',
           model: 'Actor'
         } 
      })
  .exec(    
    function(err, users){

      mlm_writer.pipe(fs.createWriteStream('results/vaping.csv'));
  

      for (var i = users.length - 1; i >= 0; i--) 
      {
        //console.log('print joined tables: ', users[0].feedAction[0].comments.length==0);
        var mlm = {};
        //var sur = {};
        //var sums = {};
        mlm.Participant_ID = users[i].UID;

        //per feedAction
        mlm.Agg_exp = 0;
        mlm.Agg_com = 0;
        mlm.Agg_likes = 0;
        mlm.Agg_flag =0;

        var dict= {ALID1A: 209 , ALID2A: 150, ALID3A: 151, ALIDB :210, ALID2B: 152, ALID3B: 153, ALID1C: 211, ALID2C: 154, ALID3C: 155, ALID1D: 212, ALID2D: 156, ALID3D:157, RVID1A: 138, RVID2A: 139, RVID3A:144, RVID4A:145, RVID1B:140, RVID2B:141, RVID3B: 146, RVID4B: 147, RVID1C: 142, RVID2C:143, RVID3C:148, RVID4C:149, SNID1A: 213, SNID2A:214, SNID3A: 126, SNID1B:215, SNID2B:216, SNID3B:127};
        // for each post 

        let str = "ALID1A_exp ALID1A_com ALID1A_like ALID1A_flag ALID2A_exp ALID2A_com ALID2A_like ALID2A_flag ALID3A_exp ALID3A_com ALID3A_like ALID3A_flag	 ALID1B_exp ALID1B_com ALID1B_like ALID1B_flag ALID2B_exp ALID2B_com ALID2B_like ALID2B_flag ALID3B_exp ALID3B_com ALID3B_like ALID3B_flag ALID1C_exp ALID1C_com ALID1C_like ALID1C_flag ALID2C_exp ALID2C_com ALID2C_like ALID2C_flag ALID3C_exp ALID3C_com ALID3C_like ALID3C_flag RVID1A_exp RVID1A_com RVID1A_like RVID1A_flag RVID2A_exp RVID2A_com RVID2A_like RVID2A_flag RVID3A_exp RVID3A_com RVID3A_like RVID3A_flag RVID4A_exp RVID4A_com RVID4A_like RVID4A_flag RVID1B_exp RVID1B_com RVID1B_like RVID1B_flag RVID2B_exp RVID2B_com RVID2B_like RVID2B_flag RVID3B_exp RVID3B_com RVID3B_like RVID3B_flag RVID4B_exp RVID4B_com RVID4B_like RVID4B_flag RVID1C_exp RVID1C_com RVID1C_like RVID1C_flag RVID2C_exp RVID2C_com RVID2C_like RVID2C_flag RVID3C_exp RVID3C_com RVID3C_like RVID3C_flag RVID4C_exp RVID4C_com RVID4C_like RVID4C_flag SNID1A_exp SNID1A_com SNID1A_like SNID1A_flag SNID1A_reply1_like SNID1A_reply1_flag SNID1A_reply2_like SNID1A_reply2_flag SNID2A_exp SNID2A_com SNID2A_like SNID2A_flag SNID2A_reply1_like SNID2A_reply1_flag SNID2A_reply2_like SNID2A_reply2_flag SNID2A_reply3_like SNID2A_reply3_flag SNID2A_reply4_like SNID2A_reply4_flag SNID3A_exp SNID3A_com SNID3A_like SNID3A_flag SNID3A_reply1_like SNID3A_reply1_flag SNID3A_reply2_like SNID3A_reply2_flag SNID3A_reply3_like SNID3A_reply3_flag SNID3A_reply4_like SNID3A_reply4_flag SNID3A_reply5_like SNID3A_reply5_flag SNID3A_reply6_like SNID3A_reply6_flag SNID1B_exp SNID1B_com SNID1B_like SNID1B_flag SNID1B_reply1_like SNID1B_reply1_flag SNID1B_reply2_like SNID1B_reply2_flag SNID2B_exp SNID2B_com SNID2B_like SNID2B_flag SNID2B_reply1_like SNID2B_reply1_flag SNID2B_reply2_like SNID2B_reply2_flag SNID2B_reply3_like SNID2B_reply3_flag SNID2B_reply4_like SNID2B_reply4_flag SNID3B_exp SNID3B_com SNID3B_like SNID3B_flag SNID3B_reply1_like SNID3B_reply1_flag SNID3B_reply2_like SNID3B_reply2_flag SNID3B_reply3_like SNID3B_reply3_flag SNID3B_reply4_like SNID3B_reply4_flag SNID3B_reply5_like SNID3B_reply5_flag SNID3B_reply6_like SNID3B_reply6_flag" ;
        const myarray = str.split(" ");
        //console.log("dddddd  : "  +myarray[0]);
        for (var w=0;w<myarray.length ;w++)
        {
          mlm[myarray[w]]=0;
          //console.log("dddddd  : "  +myarray[i]);
         
        }
       // console.log(users[i].posts);
        //per feedAction
        for (var k = users[i].feedAction.length - 1; k >= 0; k--) 
        {
         //console.log('make sure it is running for ');
          //console.log(users[i].feedAction[k].posts);
          if(users[i].feedAction[k].post != null )
          {
            if(users[i].feedAction[k].post.post_class == 'normal' )
            {
              mlm.Agg_exp++;
              if(users[i].feedAction[k].comments.length!=0  )
              {
                if(users[i].feedAction[k].comments.new_comment)
                {
                  mlm.Agg_com++;
                }
                
              }
              if(users[i].feedAction[k].liked)
              {
                mlm.Agg_likes++;
              }
              if(users[i].feedAction[k].flagTime.length !=0)
              {
                mlm.Agg_flag++;
              }

              //console.log('make sure it is running for per feedAction');
            }

              for (var w=0;w<myarray.length ;w++)
            {

              //console.log("really ?");
              var array = myarray[w].split("_");
              //console.log(array);
              //const array = myarray[0].split("_");
              if(array.length==2)
              {
                if(users[i].feedAction[k].post.post_id==dict[array[0]])
                {
                  switch(array[1]){
                    case "exp" :
                      mlm[myarray[w]]=1;
                      //console.log(array);
                      break;
                    case "com" :
                      if(users[i].feedAction[k].comments.new_comment)
                      {
                        //console.log(array);
                        mlm[myarray[w]]=1;
                      }
                      break;
                    case "like" :
                      if(users[i].feedAction[k].liked)
                      {
                        //console.log(array);
                        mlm[myarray[w]]=1;
                      }
                      break;
                    case "flag" :
                      if(users[i].feedAction[k].flagTime.length !=0)
                      {
                        //console.log(array);
                        mlm[myarray[w]]=1;
                      }
                  }
                

                }
              }
              else if(array.length==3)
              {
                //console.log("really ?");
                if(users[i].feedAction[k].post.post_id==dict[array[0]] && users[i].feedAction[k].comments[(array[1].replace(/[^0-9]/g, ''))-1]!=null)
                {
                  switch(array[2]){
                    case "like" :
                      if(users[i].feedAction[k].comments[(array[1].replace(/[^0-9]/g, ''))-1].liked)
                      {
                       //console.log(array);
                        mlm[myarray[w]]=1;
                      }
                      break;
                    case "flag" :
                      if(users[i].feedAction[k].comments[(array[1].replace(/[^0-9]/g, ''))-1].flagged)
                      {
                        //console.log(array);
                        mlm[myarray[w]]=1;
                      }
                  }
                

                }
              }
            }
          }
          

          
        }//for Per FeedAction

      //mlm.GeneralReplyNumber = users[i].numReplies + 1;
      


      mlm_writer.write(mlm);
      //s_writer.write(sur);


    }
    //for each user

    /*
    for (var zz = 0; zz < mlm_array.length; zz++) {
      //console.log("writing user "+ mlm_array[zz].email);
      //console.log("writing Bully Post "+ mlm_array[zz].BullyingPost);
      mlm_writer.write(mlm_array[zz]);
    }
    */
    //console.log("Post Table should be "+ sur_array.length);
     
      
    mlm_writer.end();
    //summary_writer.end();
    //s_writer.end();
    console.log('Wrote MLM!');
    mongoose.connection.close();

  });


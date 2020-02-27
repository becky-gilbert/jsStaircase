// Becky Gilbert
// Based on Hadrien Jean's StaircaseJS code: https://github.com/hadrienj/StaircaseJS

function Staircase(stairs) {
  this.stairs = {};
  for (var i in stairs) {
    this.stairs[i] = stairs[i];
    this.stairs[i].name = i;
    // Check minimum requirements
    if (typeof stairs[i].firstVal==="undefined") {
        throw new Error("No firstVal specified for "+i);
    } else if (stairs[i].hasOwnProperty("firstVal")) {
      this.stairs[i].firstVal = stairs[i].firstVal;
    }
    if (typeof stairs[i].stepChangeFactor==="undefined") {
      throw new Error("Must specify a stepChangeFactor for "+i);
    } else {
      this.stairs[i].stepChangeFactor = stairs[i].stepChangeFactor;
    }
    if (typeof stairs[i].firstStepSize==="undefined") {
      throw new Error("Must specify a firstStepSize for "+i);
    } else {
      this.stairs[i].firstStepSize = stairs[i].firstStepSize;
    }
    this.stairs[i].stepSizeLimits = stairs[i].stepSizeLimits || [0,1];
    // NOTE: easier is always 'up', even if it is a numerical decrease in val
    this.stairs[i].down = stairs[i].down || 1; // N-down 
    this.stairs[i].up = stairs[i].up || 1; // N-up 
    this.stairs[i].direction = stairs[i].direction || -1; // -1: lower val is harder | 1: lower val is easier
    this.stairs[i].reversalLimit = stairs[i].reversalLimit || 0; // Maximum reversals. 0: infinite
    this.stairs[i].startingMoveDirection = stairs[i].startingMoveDirection || "down"; // either 'up' or 'down'
    this.stairs[i].limits = stairs[i].limits || false; // difficulty value limits
    this.stairs[i].val = stairs[i].val || [this.stairs[i].firstVal]; // difficulty value
    this.stairs[i].maxTrialsAtMinVal = this.stairs[i].maxTrialsAtMinVal || false; // maximum number of trials at minimum difficulty before triggering reversal. Minimum difficulty is taken from 'limits'.
    this.stairs[i].active = stairs[i].active || (false); // A random staircase is activated using Staircase.init() so they all start disabled by default.
    this.stairs[i].sameStairMax = stairs[i].sameStairMax || -1; 
    this.stairs[i].limitReached = stairs[i].limitReached || false; 
    this.stairs[i].isReversal = stairs[i].isReversal || []; // whether or not is this trial a reversal
    this.stairs[i].isCorrResponse = stairs[i].isCorrResponse || []; // whether or not the response for this trial is correct
    this.stairs[i].reversals = stairs[i].reversals || 0; // reversal count
    this.stairs[i].successiveGood = stairs[i].successiveGood || 0;
    this.stairs[i].successiveBad = stairs[i].successiveBad || 0;
    this.stairs[i].sameStairCount = stairs[i].sameStairCount || 0;
    this.stairs[i].trialCount = stairs[i].trialCount || 0;
    this.stairs[i].stepSizeArray = [stairs[i].firstStepSize]; // used internally to track changes in step size 
    this.stairs[i].currentMoveDirection = stairs[i].startingMoveDirection;
    this.stairs[i].moveDirectionArray = [stairs[i].startingMoveDirection]; // used internally to track direction history
    this.stairs[i].downStartingDifficulty = stairs[i].downStartingDifficulty || stairs[i].down; // N-down at starting difficulty, if different from N-down for the rest of the trials
    this.stairs[i].finalValAvgN = stairs[i].finalValAvgN || -1; // how many reversals to average over, -1 = all
    this.stairs[i].verbosity = stairs[i].verbosity || 0; // Logging verbosity: 0-off; 1-on
    if (this.stairs[i].verbosity>0) {
      console.log("Built staircase '"+this.stairs[i].name+"'\nStart="+this.stairs[i].firstVal+"; ValueLimits=["+this.stairs[i].limits[0]+", "+this.stairs[i].limits[1]+"]; Starting direction=",this.stairs[i].startingMoveDirection+"; StepChangeFactor="+this.stairs[i].stepChangeFactor.toFixed(2).toString()+"; StepSizeLimits="+this.stairs[i].stepSizeLimits);
    }
  }
  this.tasks = { // returns new difficulty value
    easier: function(sc, stair) { // easier is 'up' (last response was incorrect)
      stair.trialCount++;
      stair.sameStairCount++;
      stair.successiveBad++;
      stair.successiveGood = 0;
      var diff_value;

      // this is true/false depending on whether we've met the up/down response threshold
      // if true then difficulty value will change, if false then difficulty value stays the same
      // also resets the successive good/bad counts and updates the up/down direction for the next trial 
      var met_threshold = sc.checkSuccessiveResponseThreshold(stair);

      // this is true/false depending on whether the current trial is a reversal, 
      // which is determined by comparing the direction for the current trial vs the next direction
      // also updates the reversals and isReversal properties of the stair
      var is_reversal = sc.checkForReversal(stair);

      var curr_step_size = stair.stepSizeArray[stair.stepSizeArray.length-1];
      var new_step_size = curr_step_size;
      // if is reversal, change step size and check step size limits, otherwise step size is the same
      if (is_reversal) {
        new_step_size = curr_step_size * stair.stepChangeFactor;
        stair.stepSizeArray.push(new_step_size);
        sc.checkStepSizeLimits(stair);
        if (stair.verbosity>0) {
          console.log('new step size: ', stair.stepSizeArray[stair.stepSizeArray.length - 1]);
        }
      } else {
        if (stair.verbosity>0) {
          console.log('stair verbosity: ', stair.verbosity);
          console.log('same step size: ', new_step_size);
        }
        stair.stepSizeArray.push(new_step_size);
      }

      // if down threshold is met, change the difficulty value and check limits, otherwise difficulty is the same
      if (met_threshold) {
        // change difficulty value
        if (stair.direction == '1') { // higher values = harder, lower values = easier  
          diff_value = stair.val[stair.val.length-1]-stair.stepSizeArray[stair.stepSizeArray.length-1]; 
        } else { // higher values = easier, lower values = harder
          diff_value = stair.val[stair.val.length-1]+stair.stepSizeArray[stair.stepSizeArray.length-1]; 
        }
        if (stair.verbosity>0) {
          console.log('current direction: ', stair.moveDirectionArray[stair.moveDirectionArray.length-1]);
        }
        return diff_value;

      } else {
        // down threshold not met so difficulty value stays the same
        diff_value = stair.val[stair.val.length-1];
        return diff_value;
      }
    },
    harder: function(sc, stair) { // harder is 'down' (last response was correct)
      stair.trialCount++;
      stair.sameStairCount++;
      stair.successiveGood++;
      stair.successiveBad = 0;
      var diff_value;

      // this is true/false depending on whether we've met the up/down response threshold
      // if true then difficulty value will change, if false then difficulty value stays the same
      // also resets the successive good/bad counts and updates the up/down direction for the next trial 
      var met_threshold = sc.checkSuccessiveResponseThreshold(stair);

      // this is true/false depending on whether the current trial is a reversal, 
      // which is determined by comparing the direction for the current trial vs the next direction
      // also updates the reversals and isReversal properties of the stair
      var is_reversal = sc.checkForReversal(stair);

      var curr_step_size = stair.stepSizeArray[stair.stepSizeArray.length-1];
      var new_step_size = curr_step_size;
      var max_trials_at_min_val_reached = false;
      // if is reversal, change step size and check step size limits, otherwise step size is the same
      if (is_reversal) {
        new_step_size = curr_step_size * stair.stepChangeFactor;
        stair.stepSizeArray.push(new_step_size);
        sc.checkStepSizeLimits(stair);
        if (stair.verbosity>0) {
          console.log('new step size: ', stair.stepSizeArray[stair.stepSizeArray.length - 1]);
        }
        // check to see if the reversal occurred because we hit the maxTrialsAtMinVal limit, 
        // if so, then the difficulty should move in the other direction! (easier instead of harder)
        // 'moveDirectionArray' for next trial was set in the 'checkForReversal' function
        if (stair.moveDirectionArray[stair.trialCount] == "up") {
          // the only reason the next trial should be 'up' is if we hit the maxTrialsAtMinVal limit
          max_trials_at_min_val_reached = true;
        }
      } else {
        if (stair.verbosity>0) {
          console.log('same step size: ', new_step_size);
        }
        stair.stepSizeArray.push(new_step_size);
      }

      // if down threshold is met, change the difficulty value and check limits, otherwise difficulty is the same
      if (met_threshold) {
        // change difficulty value
        if (!max_trials_at_min_val_reached) {
          // task should get harder
          if (stair.direction == '1') { // higher values = harder, lower values = easier  
            diff_value = stair.val[stair.val.length-1]+stair.stepSizeArray[stair.stepSizeArray.length-1]; 
          } else { // higher values = easier, lower values = harder
            diff_value = stair.val[stair.val.length-1]-stair.stepSizeArray[stair.stepSizeArray.length-1]; 
          }
        } else {
          // task should get easier (go up because max trials at min difficulty value has been reached)
          if (stair.direction == '1') { // higher values = harder, lower values = easier  
            diff_value = stair.val[stair.val.length-1]-stair.stepSizeArray[stair.stepSizeArray.length-1]; 
          } else { // higher values = easier, lower values = harder
            diff_value = stair.val[stair.val.length-1]+stair.stepSizeArray[stair.stepSizeArray.length-1]; 
          }
        }
        if (stair.verbosity>0) {
          console.log('current direction: ', stair.moveDirectionArray[stair.moveDirectionArray.length-1]);
        }
        return diff_value;
      } else {
        // down threshold not met so difficulty value stays the same
        diff_value = stair.val[stair.val.length-1];
        return diff_value;
      }
    }
  };
}
Staircase.prototype.choose = function(goodAns) {
  var stair = this.getActive();
  var ans = (goodAns) ? 'harder' : 'easier';
  var acc = (goodAns) ? 'correct' : 'incorrect';
  if (stair.verbosity>0) {
    console.log("Staircase '"+stair.name+"':\nLast response = "+acc+", direction = "+ans);
  }
  var out = this.tasks[ans](this, stair); // returns new difficulty value, updates value, step size, reversals etc. 
  return out;
};
Staircase.prototype.checkLimits = function(currentStair) {
  var stair = currentStair;
  // check difficulty value limits
  if (stair.val[stair.val.length - 1] < stair.limits[0]) {
    stair.val[stair.val.length - 1] = stair.limits[0];
    stair.limitReached = true;
  } else if (stair.val[stair.val.length - 1] > stair.limits[1]) {
    stair.val[stair.val.length - 1] = stair.limits[1];
    stair.limitReached = true;
  } else {
    stair.limitReached = false;
  }
};
Staircase.prototype.checkStepSizeLimits = function(currentStair) {
  var stair = currentStair;
  if (stair.operation == "factor") {
    // check step size limits
    if (stair.stepSizeArray[stair.stepSizeArray.length - 1] < stair.stepSizeLimits[0]) {
      stair.stepSizeArray[stair.stepSizeArray.length - 1] = stair.stepSizeLimits[0];
      stair.stepSizeLimitReached = true;
    } else if (stair.stepSizeArray[stair.stepSizeArray.length - 1] > stair. stepSizeLimits[1]) {
      stair.stepSizeArray[stair.stepSizeArray.length - 1] = stair.stepSizeLimits[1];
      stair.stepSizeLimitReached = true;
    } else {
      stair.stepSizeLimitReached = false;
    }
    if (stair.verbosity>0 && stair.stepSizeLimitReached) {
      console.log('step size limit reached: ', stair.stepSizeArray[stair.stepSizeArray.length - 1]);
    }
  }
};
Staircase.prototype.checkForReversal = function(currentStair) {  
  // moveDirectionArray has already been updated with the direction for the next trial when this function is called
  // so this compares the current trial direction with the next one
  var stair = currentStair;
  if (stair.verbosity>0) {
    console.log('check for reversal, move direction array: ', stair.moveDirectionArray);
  }
  if (stair.moveDirectionArray[stair.trialCount] == "down" && stair.moveDirectionArray[stair.trialCount-1] == "up") {
    stair.isReversal.push(true);
    stair.reversals++;
    if (stair.verbosity>0) {
      console.log('reversal '+stair.reversals+'; up to down');
    }
    return true;
  } else if (stair.moveDirectionArray[stair.trialCount] == "up" && stair.moveDirectionArray[stair.trialCount-1] == "down") {
    stair.isReversal.push(true);
    stair.reversals++;
    if (stair.verbosity>0) {
      console.log('reversal '+stair.reversals+'; down to up');
    }
    return true;
  } else if (stair.maxTrialsAtMinVal && stair.moveDirectionArray[stair.trialCount] == "down") {
    // if 'maxTrialsAtMinVal' is set and the next trial direction is 'down', then check whether we've hit the maxTrialsAtMinVal threshold for a reversal 
    var last_n_vals = stair.val.slice(-stair.maxTrialsAtMinVal);
    var all_vals_at_limit = last_n_vals.every(function(val) {return val == stair.limits[0];});
    if (all_vals_at_limit) {
      // mark this as a reversal and change the next trial direction to 'up'
      stair.isReversal.push(true);
      stair.reversals++;
      stair.moveDirectionArray[stair.trialCount] = 'up';
      if (stair.verbosity>0) {
        console.log('reversal '+stair.reversals+'; max trials at min difficulty');
      }
      return true;
    } else {
      stair.isReversal.push(false);
      return false;
    }
  } else {
    stair.isReversal.push(false);
    return false;
  }
};
Staircase.prototype.checkSuccessiveResponseThreshold = function(currentStair) {
  var stair = currentStair;
  var all_trials_starting_difficulty = stair.val.every( (val, i, arr) => val === arr[0] );
  if (stair.isCorrResponse[stair.trialCount-1] === true) { // last response was correct
    if (stair.successiveGood>=stair.down) {
      // move down if we've met the down threshold
      stair.successiveGood = 0;
      stair.moveDirectionArray.push("down");
      if (stair.verbosity>0) {
        console.log('correct response, down threshold met');
      }
      return true;
    } else {
      
      if (all_trials_starting_difficulty && stair.successiveGood>=stair.downStartingDifficulty) {
        // move down if we're still at the starting level and met the downStartingDifficulty threshold
        stair.successiveGood = 0;
        stair.moveDirectionArray.push("down");
        if (stair.verbosity>0) {
          console.log('correct response, starting difficulty down threshold met');
        }
        return true;
      } else {
        // otherwise we haven't met any down thresholds
        stair.moveDirectionArray.push(stair.moveDirectionArray[stair.trialCount-1]);
        if (stair.verbosity>0) {
          console.log('correct response, down threshold not met');
        }
        return false;
      }
    }
  } else { // last response was incorrect
    if (all_trials_starting_difficulty) {
      // if this is still the starting difficulty level then we don't want this to count as a reversal
      // so keep the direction as 'down'
      stair.moveDirectionArray.push('down');
      if (stair.verbosity>0) {
        console.log('incorrect response, still starting difficulty so up threshold not met');
      }
      return false;
    } else if (stair.successiveBad>=stair.up) {
      // move up if we've met the up threshold (and if this isn't still the starting difficulty level)
      stair.successiveBad = 0;
      stair.moveDirectionArray.push("up");
      if (stair.verbosity>0) {
        console.log('incorrect response, up threshold met');
      }
      return true;
    } else {
      // otherwise we haven't met the up threshold
      stair.moveDirectionArray.push(stair.moveDirectionArray[stair.trialCount-1]);
      if (stair.verbosity>0) {
        console.log('incorrect response, up threshold not met');
      }
      return false;
    }
  }
};
Staircase.prototype.next = function(goodAns) {
  this.checkErr.ARG('next', arguments, 1);
  // find the active stair
  var stair = this.getActive();
  // record accuracy for last trial
  stair.isCorrResponse.push(goodAns);
  // get new difficulty value, change step size if necessary
  stair.val[stair.val.length] = this.choose(goodAns); 
  // checkLimits function will change the difficulty value if limit is reached
  this.checkLimits(stair); 
  if (stair.verbosity>0) {
    console.log('difficulty: ', stair.val[stair.val.length-1]);
  }
  return stair.val[stair.val.length-1];
};
Staircase.prototype.init = function () {
  // will return undefined if there are no available (unlocked) stairs
  var choices = [];
  // deactivate all other staircases
  for (var i in this.stairs) {
    if (this.stairs[i].active) {
      this.deactivate(i);
    }
    // choose among unlocked staircases only
    if (!this.stairs[i].lock) {
      choices[choices.length] = i;
    }
  }
  // choose one stair to activate
  if (choices.length>0) {
    var rand = randInt(0, choices.length-1);
    this.activate(choices[rand]);
    return this;
  }
};
Staircase.prototype.changeActive = function() {
  var possibleStairs = [];
  var currentActive = this.getActive();
  for (var i in this.stairs) {
    if (!this.stairs[i].active && !this.stairs[i].lock) {
      possibleStairs[possibleStairs.length] = i;
    } else if (this.stairs[i].active) {
        this.deactivate(i);
    }
  }
  if (possibleStairs.length>0) {
    var rand = randInt(0, possibleStairs.length-1);
    this.activate(possibleStairs[rand]);
  } else {
    this.activate(currentActive);
  }
};
Staircase.prototype.setSameStairMax = function(max, stair) {
  this.checkErr.ARG('setSameStairMax', arguments, 2);
  this.checkErr.UNDEFINED(this.stairs, stair);
  return this.stairs[stair].sameStairMax = max;
};
Staircase.prototype.get = function(stair) {
  this.checkErr.ARG('get', arguments, 1);
  this.checkErr.UNDEFINED(this.stairs, stair);
  return this.stairs[stair].val;
};
Staircase.prototype.getLast = function(stair) {
  this.checkErr.ARG('getLast', arguments, 1);
  this.checkErr.UNDEFINED(this.stairs, stair);
  return this.stairs[stair].val[this.stairs[stair].val.length-1];
};
Staircase.prototype.getActive = function() {
  // will return 'undefined' if there are no active stairs
  for (var i in this.stairs) {
    if (this.stairs[i].active) {
      return this.stairs[i];
    }
  }
};
Staircase.prototype.getActiveName = function() {
  // will return 'undefined' if there are no active stairs
  for (var i in this.stairs) {
    if (this.stairs[i].active) {
      return this.stairs[i].name;
    }
  }
};
Staircase.prototype.activate = function(stair) {
  this.checkErr.ARG('activate', arguments, 1);
  this.checkErr.UNDEFINED(this.stairs, stair);
  this.stairs[stair].active = true;
  if(this.stairs[stair].verbosity>0) {
    console.log("Staircase '"+this.stairs[stair].name+"' now active");
  }
};
Staircase.prototype.deactivate = function(stair) {
  this.checkErr.ARG('deactivate', arguments, 1);
  this.checkErr.UNDEFINED(this.stairs, stair);
  this.stairs[stair].active = false;
  if(this.stairs[stair].verbosity>0) {
    console.log("Staircase '"+this.stairs[stair].name+"' deactivated");
  }
};
Staircase.prototype.resetCounts = function(stair) {
  this.stairs[stair].sameStairCount = 0;
  this.stairs[stair].successiveGood = 0;
  this.stairs[stair].limitReached = false;
};
Staircase.prototype.isActive = function(stair) {
  this.checkErr.ARG('isActive', arguments, 1);
  this.checkErr.UNDEFINED(this.stairs, stair);
  return this.stairs[stair].active;
};
Staircase.prototype.active = function(stair) {
  this.checkErr.ARG('active', arguments, 1);
  this.checkErr.UNDEFINED(this.stairs, stair);
  for (var i in this.stairs) {
    if (this.stairs[i].active) {
      return i;
    }
  }
};
Staircase.prototype.lock = function(stair) {
  this.checkErr.ARG('lock', arguments, 1);
  this.checkErr.UNDEFINED(this.stairs, stair);
  this.stairs[stair].lock = true;
};
Staircase.prototype.unlock = function(stair) {
  this.checkErr.ARG('unlock', arguments, 1);
  this.checkErr.UNDEFINED(this.stairs, stair);
  this.stairs[stair].lock = false;
};
Staircase.prototype.isLocked = function(stair) {
  this.checkErr.ARG('isLocked', arguments, 1);
  this.checkErr.UNDEFINED(this.stairs, stair);
  return this.stairs[stair].lock;
};
Staircase.prototype.setVal = function(stair, val) {
  this.checkErr.ARG('setVal', arguments, 2);
  this.checkErr.UNDEFINED(this.stairs, stair);
  this.stairs[stair].val[this.stairs[stair].val.length] = val;
};
Staircase.prototype.getReversals = function (stair) {
    this.checkErr.ARG('getFinalVal', arguments, 1);
    this.checkErr.UNDEFINED(this.stairs, stair);
    return this.stairs[stair].reversals;
};
Staircase.prototype.reversalLimitReached = function(stair) {
    this.checkErr.ARG('getFinalVal', arguments, 1);
    this.checkErr.UNDEFINED(this.stairs, stair);
    var reversals = this.getReversals(stair);
    if (this.stairs[stair].verbosity>0) {
      console.log('current number of reversals: '+reversals);
    }
    return (reversals>=this.stairs[stair].reversalLimit && this.stairs[stair].reversalLimit!==0);
};
Staircase.prototype.getFinalVal = function(stair) {
    this.checkErr.ARG('getFinalVal', arguments, 1);
    this.checkErr.UNDEFINED(this.stairs, stair);
    var nReversalsToAvg = this.stairs[stair].finalValAvgN;
    var reversals = this.getReversals(stair);
    var sum = 0;
    for(var i=0;i<reversals.length;i++)
        sum = sum + reversals[i];
    return sum/reversals.length; // Convergence value is the mean of N reversal points
};
Staircase.prototype.getResultsObj = function(stair) {
  return this.stairs[stair];
};
Staircase.prototype.getValuesArray = function(stair) {
  return this.stairs[stair].val;
};
Staircase.prototype.getAccuracyArray = function(stair) {
  return this.stairs[stair].isCorrResponse;
};
var Staircase_CheckErr = function() {};
Staircase_CheckErr.prototype.UNDEFINED = function(thisStairs, stair) {
  if (thisStairs[stair]===undefined) {
    throw new Error("Unable to find the staircase '"+stair+"'");
  }
};
Staircase_CheckErr.prototype.ARG = function(func, arg, argNum) {
  if (arg.length===0) {
    throw new Error("Wrong number of arguments for the method '"+func+"'"+". Required: "+argNum);
  }
};
Staircase.prototype.checkErr = new Staircase_CheckErr(); // Set up the error checker

// Returns a random integer between min (inclusive) and max (inclusive)
// Using Math.round() will give you a non-uniform distribution!
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
# jsStaircase

This is a JavaScript library for controlling one or more adaptive staircases. Much of this code is based on @hadrienj's StaircaseJS library. Please see the StaircaseJS readme file for more information on the background, usage, and examples: https://github.com/hadrienj/StaircaseJS/blob/master/readme.md. The jsStaircase library is a modified version by Becky Gilbert (@becky-gilbert) that provides additional options, such as a dynamic step size, as well as a number of other changes to the core implementation and methods. 

## What is this library used for?
Staircase procedures are often used in the behavioral sciences (cognitive psychology, psycholinguistics, psychophysics, etc.) as an efficient method for estimating an individual's performance threshold on a particular task. They refer to tasks where the difficulty level is adjusted to be easier or harder, based on an up/down rule and the participant's performance. 

For instance, a researcher may be interested in individual differences in auditory pitch discrimination. To investigate this, the researcher might present participants with pairs of sounds, and ask the participant to say which of the two sounds was higher in pitch. The difference in pitch can be adjusted dynamically across trials in order to estimate the difficulty level (pitch difference) that corresponds to a particular performance level (e.g. 80% correct) - this threshold value provides a measure of each individual's pitch discrimination ability. 

Using this library, you can generate the next difficulty level for one or more staircases, based on your staircase specifications and the accuracy of the participant's last response. For instance, a 3-down 1-up rule means that 3 correct responses results in moving 'down' (next trial becomes more difficult) and 1 incorrect response results in moving 'up' (next trial gets easier). 

The 'step size' (i.e. change in difficulty when moving up or down) is determined by a starting value and can change throughout the task. Allowing the step size to change is useful because you may want to start with larger step sizes, to more quickly move from the starting difficulty value toward the participant's threshold, and then gradually decrease the step size to get a more precise threshold estimate. 

The jsStaircase library allows you to:
- Specify the starting difficulty level and direction, either up or down.
- Specify the starting step size, change the step size by a factor, and limit the range of possible step sizes.
- Specify the maximum number of trials or direction reversals.
- Specify the maximum number of trials allowed at the minimum (hardest) difficulty value. Surpassing this limit will trigger a direction reversal, but the response will still be recorded as correct.
- Track the properties of each trial, such as whether the response was correct and whether it triggered a direction reversal.
- Track the properties of the staircase, such as the number of trials. 
- Use staircase methods to access arrays with the step sizes, difficulty values, directions, reversals, etc. from all trials, and the average difficulty level across the last N reversals.
- Run multiple staircases in parallel, e.g. to track performance separately for each condition, when different conditions are mixed together in the same block of trials.
- Either set which staircase you want to run on the next trial, or allow the library to select randomly from those that are still actively running (if there is more than one staircase).
- Specify the maximum number of times that the same staircase can be selected in a row (if there is more than one staircase).

This library differs from StaircaseJS in a few ways. First, there is no 'operation' parameter for the adjusting the difficulty level (add or multiply) and there is no 'wait' mode. This is because the add/multiply operations and wait/no-wait modes apply to when the adjustment is made to the difficulty level directly, rather than to the step size. Second, the implementation structure and logic have been substantially re-written to accommodate this different staircase method, and to integrate some additional options/parameters (e.g. limits on the step size values). However, some of the code is the same or similar; in particular the initialisation, method/property names, and many of the smaller/helper methods.

## Properties
Coming soon!

## Methods
Coming soon!

## Example
Coming soon!

# jsStaircase

This is a JavaScript library for controlling one or more adaptive staircase procedures. This code is based on Hadrien Jean's (@hadrienj) StaircaseJS library. Please see the StaircaseJS readme file for excellent documentation: https://github.com/hadrienj/StaircaseJS/blob/master/readme.md. 

The jsStaircase library is a modified version by Becky Gilbert (@becky-gilbert) that allows a dynamic step size. The jsStaircase structure and logic have been re-written to accommodate this different staircase method, and to integrate some additional options/parameters (e.g. limits on the step size values). However, some of the code is the same or similar as that used in StaircaseJS; in particular the initialisation, method/property names, and many of the smaller/helper methods. Thanks @hadrienj!

## What are staircase procedures?
Staircase procedures are often used in the behavioral sciences (cognitive psychology, psycholinguistics, psychophysics, etc.) as an efficient method for estimating an individual's performance threshold on a particular task. In tasks that use an adaptive staircase, the difficulty level is adjusted to be easier or harder using an up/down rule based on the participant's performance. 

For instance, a researcher may be interested in individual differences in auditory pitch perception. To investigate this, the researcher might present participants with pairs of sounds, and ask the participant to say which of the two sounds was higher in pitch. The difference in pitch can be adjusted dynamically across trials in order to estimate the difficulty level (pitch difference) that corresponds to a particular performance level (e.g. 80% correct) - this threshold value provides a measure of each individual's pitch discrimination ability. 

## What does this library do?
Using this library, you can generate the next difficulty level for one or more staircases, based on your staircase specifications and the accuracy of the participant's last response. For instance, a 3-down 1-up rule means that 3 correct responses results in moving 'down' (next trial becomes more difficult) and 1 incorrect response results in moving 'up' (next trial gets easier). 

The 'step size' (i.e. change in difficulty when moving up or down) is determined by a starting value and can change throughout the task. Allowing the step size to change is useful because you may want to start with larger steps, to more quickly move from the starting difficulty value toward the participant's threshold, and then gradually decrease the step size to get a more precise threshold estimate. 

The ability to track multiple staircases in parallel is useful for when you want to get separate threshold estimates for multiple within-participant conditions. For example, a researcher who is interested in pitch perception may want to estimate an individual's discrimination ability for more than one type of sound (e.g. short tones, long tones, speech). The library allows you to track multiple staircases at the same time so that, on each trial, only the information from the relevant condition is used (previous response accuracy, current step size and difficulty level, etc.). 

The jsStaircase library allows you to:
- Specify the starting difficulty level and direction, either up or down.
- Specify the starting step size, change the step size by a factor, and limit the range of possible step sizes.
- Specify the maximum number of trials or direction reversals.
- Specify the maximum number of trials allowed at the minimum (hardest) difficulty value. Surpassing this limit will trigger a direction reversal, but the response will still be recorded as correct.
- Track the properties of each trial, such as whether the response was correct and whether it triggered a direction reversal.
- Track the properties of the staircase, such as the number of trials.
- Automatically end the staircase procedure, based on a maximum number of trials or number of reversals.
- Use staircase methods to access arrays with the step sizes, difficulty values, directions, reversals, etc. from all trials, and get the average difficulty level across the last N reversals.
- Run multiple staircases in parallel, e.g. to track performance and adjust the difficulty separately for conditions that are mixed together in the same block of trials.
- Decide which staircase you want to run on the next trial, or allow the library to select randomly from those that are still actively running (if there is more than one staircase).
- Specify the maximum number of times that the library can select the same staircase consecutively (if there is more than one staircase).

## Properties
Coming soon!

## Methods
Coming soon!

## Example
Coming soon!

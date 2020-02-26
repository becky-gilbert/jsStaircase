# jsStaircase

This is a JavaScript library for controlling one or more adaptive staircases. Much of this code is based on @hadrienj's StaircaseJS library. Please see the StaircaseJS readme file for more information on the background, usage, and examples: https://github.com/hadrienj/StaircaseJS/blob/master/readme.md

The jsStaircase library is a modified version by Becky Gilbert (@becky-gilbert) that provides additional options, such as a dynamic step size, as well as a number of other changes to the core implementation and methods. 

Using this library, you can generate the next difficulty level for one or more staircases (in parallel), based on an adaptive staircase rule and accuracy of the last response. For instance, a 3-down 1-up rule means that 3 correct responses result in moving 'down' (next trial becomes more difficult) and 1 incorrect response results in moving 'up' (next trial gets easier).

The jsStaircase library allows you to:
- Specify the starting difficulty level and direction, either up or down.
- Specify the starting step size, change the step size by a factor, and limit the range of possible step sizes.
- Specify the maximum number of trials or reversals.
- Specify a maximum number of trials allowed at the minimum (hardest) difficulty value. Surpassing this limit will trigger a direction reversal, but the response will still be recorded as correct.
- Track the properties of each trial, such as whether the response was correct and whether it triggered a direction reversal.
- Track the properties of the staircase, such as the number of trials. 
- Use staircase methods to access all step sizes, difficulty values, directions, reversals, etc., and the average difficulty level across the last N reversals.
- Either specify which staircase you want to run on the next trial, or select randomly from those that are still actively running (if there is more than one staircase).
- Specify the maximum number of times that the same staircase can be selected in a row (if there is more than one staircase).

This library differs from StaircaseJS in a few important ways. First, there is no 'operation' parameter for the adjusting the difficulty level (add or multiply) and there is no 'wait' mode. This is because the add/multiply operations and wait/no-wait modes apply to when the adjustment is made to the difficulty level directly, rather than to the step size. Second, the implementation structure and logic have been substantially re-written to accommodate this different staircase method, and to integrate some additional options/parameters (e.g. limits on the step size values). However, some of the code is the same or similar; in particular the initialisation and many of the smaller/helper methods.

# To Do
- List all properties and methods
- Provide a minimal example

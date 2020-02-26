# jsStaircase

This is a JavaScript library for controlling one or more adaptive staircases. Much of this code is based on @hadrienj's StaircaseJS library. Please see the StaircaseJS readme file for more information on the background, usage, and examples: https://github.com/hadrienj/StaircaseJS/blob/master/readme.md

The jsStaircase library is a modified version by Becky Gilbert (@becky-gilbert) that provides additional options, such as a dynamic step size, as well as a number of other changes to the core implementation and methods. 

The jsStaircase library allows you to:
- Specify the starting step size, change the step size by a factor, and limit the range of possible step sizes.
- Specify the starting difficulty level and direction, either up or down.
- Specify a maximum number of trials allowed at the minimum difficulty value. Surpassing this limit will trigger a reversal (but the response will still be recorded as correct).
- Track the properties of each trial, such as whether the response was correct and whether it was a reversal.
- Track the properties of the staircase, such as the number of trials. There are also staircase methods that will return all step sizes, difficulty values, directions, reversals, etc., and the average difficulty level across the last N reversals.
- Unlike StaircaseJS, there is no 'operation' parameter for the adjusting the difficulty level (add or multiply) and there is no 'wait' mode.

# To Do
- List all properties and methods
- Give more details about differences between jsStaircase and StaircaseJS
- Provide a minimal example

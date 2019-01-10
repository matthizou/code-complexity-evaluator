# code-complexity-evaluator

Simple library and CLI tool that help you tracking the number of significant lines of code of your application.

Why ?
Getting metric is important and make a lot of sense to study the evolution of the code base.
This tool is initially written to visualize the progress of the migration of our old code base (in Coffeescript) to the new one (in Javascript) in a specific repo. Regularly ran by a reporting tool (Pluto), it would spit a number that we can see going down over time, in a graph.

Significant lines of code ?
Blank and comment lines will never be counted as such.  
After, the rules of what is a 'significant line of code' are subjective and depend on languages.
Do we count the imports at the beginning of the file ? Is a line with 3 characters worth as much as one with 100 ?
Ultimately, it doesn't really matter as long as you can't easily 'cheat' the tool: it is a relative value that will be compared to other relative values over time. What matters is that the exact same rules are used to calculate those values.

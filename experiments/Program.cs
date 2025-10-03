using System;
using Platform.Protocols.Lino;

var version1 = @"empInfo
  employees:
    (
      name (James Kirk)
      age 40
    )
    (
      name (Jean-Luc Picard)
      age 45
    )";

var parser = new Parser();
var result1 = parser.Parse(version1);

Console.WriteLine("=== BEFORE TRANSFORM ===");
Console.WriteLine(result1.Format());

var transformed = result1.TransformIndentedIdSyntax();

Console.WriteLine("\n=== AFTER TRANSFORM ===");
Console.WriteLine(transformed.Format());

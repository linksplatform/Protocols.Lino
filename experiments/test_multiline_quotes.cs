using System;
using Platform.Protocols.Lino;

static class Program
{
    static void Main()
    {
        var parser = new Parser();

        Console.WriteLine("Testing multiline quotes as described in issue #53:");
        Console.WriteLine();

        var input = @"(
  ""long
string literal representing
the reference""

  'another
long string literal
as another reference'
)";

        Console.WriteLine("Input:");
        Console.WriteLine(input);
        Console.WriteLine();

        try
        {
            var result = parser.Parse(input);
            Console.WriteLine("✓ Parsing succeeded!");
            Console.WriteLine($"Number of links: {result.Count}");

            foreach (var link in result)
            {
                Console.WriteLine($"Link: {link}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"✗ Parsing failed: {ex.Message}");
            Console.WriteLine($"Exception type: {ex.GetType().Name}");
        }
    }
}
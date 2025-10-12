# Lino Protocol Parser for C&#35;

C&#35; implementation of the Lino protocol parser using Pegasus parser
generator and Platform.Collections.

## Installation

### Package Manager

```text
Install-Package Platform.Protocols.Lino
```

### .NET CLI

```bash
dotnet add package Platform.Protocols.Lino
```

### PackageReference

```xml
<PackageReference Include="Platform.Protocols.Lino" Version="0.4.5" />
```

## Build from Source

Clone the repository and build:

```bash
git clone https://github.com/link-foundation/links-notation.git
cd links-notation/csharp
dotnet build Platform.Protocols.Lino.sln
```

## Test

Run tests:

```bash
dotnet test
```

## Usage

### Basic Parsing

```csharp
using Platform.Protocols.Lino;

// Create parser
var parser = new Parser();

// Parse Lino format string
string input = @"papa (lovesMama: loves mama)
son lovesMama
daughter lovesMama
all (love mama)";

var links = parser.Parse(input);

// Access parsed links
foreach (var link in links)
{
    Console.WriteLine(link.ToString());
}
```

### Converting Back to String

```csharp
using Platform.Protocols.Lino;

// Format links back to string
string formatted = links.Format();
Console.WriteLine(formatted);
```

### Working with Links

```csharp
// Create link programmatically
var link = new Link<string>("id", new[] { "value1", "value2" });

// Access link properties
Console.WriteLine($"ID: {link.Id}");
foreach (var value in link.Values)
{
    Console.WriteLine($"Value: {value}");
}
```

### Advanced Usage with Generic Types

```csharp
// Using numeric link addresses
var parser = new Parser<ulong>();
var numericLinks = parser.Parse("(1: 2 3)");

// Working with custom address types
var customParser = new Parser<Guid>();
```

## Syntax Examples

### Doublets (2-tuple)

```lino
papa (lovesMama: loves mama)
son lovesMama
daughter lovesMama
all (love mama)
```

### Triplets (3-tuple)

```lino
papa has car
mama has house
(papa and mama) are happy
```

### N-tuples with References

```lino
(linksNotation: links notation)
(This is a linksNotation as well)
(linksNotation supports (unlimited number (of references) in each link))
```

## API Reference

### Classes

- **Parser\<TLinkAddress\>**: Main parser class for converting strings to links
- **Link\<TLinkAddress\>**: Represents a single link with ID and values
- **LinksGroup\<TLinkAddress\>**: Container for grouping related links

### Extension Methods

- **IListExtensions.Format()**: Converts list of links back to string format
- **ILinksGroupListExtensions**: Additional operations for link groups

## Dependencies

- .NET 8.0
- Microsoft.CSharp (4.7.0)
- Pegasus (4.1.0)
- Platform.Collections (0.3.2)

## Documentation

For complete API documentation, visit:
[LinkFoundation.LinksNotation Documentation](https://link-foundation.github.io/links-notation/csharp/api/LinkFoundation.LinksNotation.html)

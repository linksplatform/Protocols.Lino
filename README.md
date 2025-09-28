# [Protocols.Lino](https://github.com/linksplatform/Protocols.Lino) (languages: en • [ru](README.ru.md))

| [![Actions Status](https://github.com/linksplatform/Protocols.Lino/workflows/js/badge.svg)](https://github.com/linksplatform/Protocols.Lino/actions?workflow=js) | [![npm Version and Downloads count](https://img.shields.io/npm/v/@linksplatform/protocols-lino?label=npm&style=flat)](https://www.npmjs.com/package/@linksplatform/protocols-lino) | **[JavaScript](js/README.md)** |
|:-|-:|:-|
| [![Actions Status](https://github.com/linksplatform/Protocols.Lino/workflows/rust/badge.svg)](https://github.com/linksplatform/Protocols.Lino/actions?workflow=rust) | [![Crates.io Version and Downloads count](https://img.shields.io/crates/v/platform-lino?label=crates.io&style=flat)](https://crates.io/crates/platform-lino) | **[Rust](rust/README.md)** |
| [![Actions Status](https://github.com/linksplatform/Protocols.Lino/workflows/csharp/badge.svg)](https://github.com/linksplatform/Protocols.Lino/actions?workflow=csharp) | [![NuGet Version and Downloads count](https://img.shields.io/nuget/v/Platform.Protocols.Lino?label=nuget&style=flat)](https://www.nuget.org/packages/Platform.Protocols.Lino) | **[C#](csharp/README.md)** |

[![Gitpod](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/linksplatform/Protocols.Lino)
[![Open in GitHub Codespaces](https://img.shields.io/badge/GitHub%20Codespaces-Open-181717?logo=github)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=linksplatform/Protocols.Lino)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4e7eb0a883e9439280c1097381d46b50)](https://app.codacy.com/gh/linksplatform/Protocols.Lino?utm_source=github.com&utm_medium=referral&utm_content=linksplatform/Protocols.Lino&utm_campaign=Badge_Grade_Settings)
[![CodeFactor](https://www.codefactor.io/repository/github/linksplatform/Protocols.Lino/badge)](https://www.codefactor.io/repository/github/linksplatform/Protocols.Lino)

LinksPlatform's Platform.Protocols.Lino Class Library.

![introduction](https://github.com/linksplatform/Documentation/raw/master/doc/Examples/json_xml_lino_comparison/b%26w.png "json, xml and lino comparison")

This library gives you an ability to convert any string that contains
links notation into a list of links and back to the string after
modifications are made.

Links notation is based on two concepts references and links. Each
reference references other link. The notation supports links with any
number of references to other links.

## Quick Start

### C&#35;

```csharp
var parser = new Platform.Protocols.Lino.Parser();
var links = parser.Parse("papa (lovesMama: loves mama)");
```

### JavaScript

```javascript
import { Parser } from '@linksplatform/protocols-lino';
const parser = new Parser();
const links = parser.parse("papa (lovesMama: loves mama)");
```

### Rust

```rust
use lino::parse_lino;
let links = parse_lino("papa (lovesMama: loves mama)").unwrap();
```

## Examples

### Links notation (lino)

#### Doublets (2-tuple)

```lino
papa (lovesMama: loves mama)
son lovesMama
daughter lovesMama
all (love mama)
```

#### Triplets (3-tuple)

```lino
papa has car
mama has house
(papa and mama) are happy
```

#### Sequences (N-tuple)

```lino
I'm a friendly AI.
(I'm a friendly AI too.)
(linksNotation: links notation)
(This is a linksNotation as well)
(linksNotation supports (unlimited number (of references) in each link))
(sequence (of references) surrounded by parentheses is a link)
parentheses may be ommitted if the whole line is a single link
```

So that means that *this* text is also links notation. So most of the
text in the world already may be parsed as links notation. That makes
links notation the most easy an natural/intuitive/native one.

## What is Links Notation?

Links Notation (Lino) is a simple, intuitive format for representing
structured data as links between ~~entities~~ references to links. It's designed to be:

- **Natural**: Most text can already be parsed as links notation
- **Flexible**: Supports any number of references in each link  
- **Universal**: Can represent doublets, triplets, and N-tuples
- **Hierarchical**: Supports nested structures with indentation

The notation uses two core concepts:

- **References**: Points to other links (like variables or identifiers)
- **Links**: Connect references together with optional identifiers

## Documentation

For detailed implementation guides and API references, see the
language-specific documentation:

- **[C# Documentation](https://linksplatform.github.io/Protocols.Lino/csharp/api/Platform.Protocols.Lino.html)**
  \- Complete API reference
- **[C# README](csharp/README.md)** - Installation and usage guide
- **[JavaScript README](js/README.md)** - Modern web development guide
- **[Rust README](rust/README.md)** - High-performance parsing guide

Additional resources:

- [Feature Comparison](FEATURE_COMPARISON.md) - LINO vs YAML/XML/JSON
  feature analysis
- [PDF Documentation](https://linksplatform.github.io/Protocols.Lino/csharp/Platform.Protocols.Lino.pdf)
  \- Complete reference for offline reading
- [Links Theory 0.0.2](https://habr.com/en/articles/895896) - Theoretical
  foundation that Links Notation fully supports

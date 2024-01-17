[![Gitpod](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/linksplatform/Protocols.Lino)

[![NuGet Version and Downloads count](https://buildstats.info/nuget/Platform.Protocols.Lino)](https://www.nuget.org/packages/Platform.Protocols.Lino)
[![Actions Status](https://github.com/linksplatform/Protocols.Lino/workflows/CD/badge.svg)](https://github.com/linksplatform/Protocols.Lino/actions?workflow=CD)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4e7eb0a883e9439280c1097381d46b50)](https://app.codacy.com/gh/linksplatform/Protocols.Lino?utm_source=github.com&utm_medium=referral&utm_content=linksplatform/Protocols.Lino&utm_campaign=Badge_Grade_Settings)
[![CodeFactor](https://www.codefactor.io/repository/github/linksplatform/Protocols.Lino/badge)](https://www.codefactor.io/repository/github/linksplatform/Protocols.Lino)

# [Protocols.Lino](https://github.com/linksplatform/Protocols.Lino) ([русская версия](README.ru.md))
LinksPlatform's Platform.Protocols.Lino Class Library.

![introduction](https://github.com/linksplatform/Documentation/raw/master/doc/Examples/json_xml_lino_comparison/b%26w.png "json, xml and lino comparison")

This library gives you an ability to convert any string that contains links notation into a list of links and back to the string after modifications are made.

Links notation is based on two concepts references and links. Each reference references other link. If no link defines concrete reference it assumed that such link is a point link. The notation supports links with any number of references to other links.

Namespace: [Platform.Protocols.Lino](https://linksplatform.github.io/Protocols.Lino/csharp/api/Platform.Protocols.Lino.html)

NuGet package: [Platform.Protocols.Lino](https://www.nuget.org/packages/Platform.Protocols.Lino)

## Examples
### Links notation (lino)

#### Doublets (2-tuple)

```
papa (lovesMama: loves mama)
son lovesMama
daughter lovesMama
all (love mama)
```

#### Triplets (3-tuple)

```
papa has car
mama has house
(papa and mama) are happy
```

#### Sequences (N-tuple)

```
I'm a friendly AI.
(I'm a friendly AI too.)
(linksNotation: links notation)
(This is a linksNotation as well)
(linksNotation supports (unlimited number of references in each link))
(each 
```

### Getting a [IList](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic.ilist-1)\<[Link](https://linksplatform.github.io/Protocols.Lino/csharp/api/Platform.Protocols.Lino.Link.html)\>
```C#
(new Platform.Protocols.Lino.Parser()).Parse(@string)
```
### Formatting the [IList](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic.ilist-1)\<[Link](https://linksplatform.github.io/Protocols.Lino/csharp/api/Platform.Protocols.Lino.Link.html)\> back to string
```C#
using Platform.Protocols.Lino;
```
```C#
links.Format()
```

## [Documentation](https://linksplatform.github.io/Protocols.Lino)
*   Struct [Link](https://linksplatform.github.io/Protocols.Lino/csharp/api/Platform.Protocols.Lino.Link.html).
*   Method [Parser](https://linksplatform.github.io/Protocols.Lino/csharp/api/Platform.Protocols.Lino.Parser.html).[Parse](https://linksplatform.github.io/Protocols.Lino/csharp/api/Platform.Protocols.Lino.Parser.html#Platform_Communication_Protocol_Lino_Parser_Parse_System_String_System_String_)
*   Method [IListExtensions](https://linksplatform.github.io/Protocols.Lino/csharp/api/Platform.Protocols.Lino.IListExtensions.html).[Format](https://linksplatform.github.io/Protocols.Lino/csharp/api/Platform.Protocols.Lino.IListExtensions.html#Platform_Communication_Protocol_Lino_IListExtensions_Format_System_Collections_Generic_IList_Platform_Communication_Protocol_Lino_Link__)

[PDF file](https://linksplatform.github.io/Protocols.Lino/csharp/Platform.Protocols.Lino.pdf) with code for e-readers.

## Depend on
*   [Microsoft.CSharp](https://www.nuget.org/packages/Microsoft.CSharp)
*   [Pegasus](https://github.com/otac0n/Pegasus)
*   [Platform.Collections](https://github.com/linksplatform/Collections)

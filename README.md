[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4e7eb0a883e9439280c1097381d46b50)](https://app.codacy.com/gh/linksplatform/Communication.Protocol.Lino?utm_source=github.com&utm_medium=referral&utm_content=linksplatform/Communication.Protocol.Lino&utm_campaign=Badge_Grade_Settings)
﻿[![NuGet Version and Downloads count](https://buildstats.info/nuget/Platform.Communication.Protocol.Lino)](https://www.nuget.org/packages/Platform.Communication.Protocol.Lino)
[![Actions Status](https://github.com/linksplatform/Communication.Protocol.Lino/workflows/CD/badge.svg)](https://github.com/linksplatform/Communication.Protocol.Lino/actions?workflow=CD)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c25f708dc08b4f7e8d96c671378bb1ad)](https://app.codacy.com/app/drakonard/Communication.Protocol.Lino?utm_source=github.com&utm_medium=referral&utm_content=linksplatform/Communication.Protocol.Lino&utm_campaign=Badge_Grade_Dashboard)
[![CodeFactor](https://www.codefactor.io/repository/github/linksplatform/Communication.Protocol.Lino/badge)](https://www.codefactor.io/repository/github/linksplatform/Communication.Protocol.Lino)

# [Communication.Protocol.Lino](https://github.com/linksplatform/Communication.Protocol.Lino) ([русская версия](README.ru.md))
LinksPlatform's Platform.Communication.Protocol.Lino Class Library.

This library gives you an ability to convert any string that contains links notation into a list of links and back to the string after modifications are made.

Links notation is based on two concepts references and links. Each reference references other link. If no link defines concrete reference it assumed that such link is a point link. The notation supports links with any number of references to other links.

Namespace: [Platform.Communication.Protocol.Lino](https://linksplatform.github.io/Communication.Protocol.Lino/csharp/api/Platform.Communication.Protocol.Lino.html)

NuGet package: [Platform.Communication.Protocol.Lino](https://www.nuget.org/packages/Platform.Communication.Protocol.Lino)

## Examples
### Links notation (lino)
```
papa (lovesMama: loves mama)
son lovesMama
daughter lovesMama
all (love mama)
```
### Getting a [IList](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic.ilist-1)\<[Link](https://linksplatform.github.io/Communication.Protocol.Lino/csharp/api/Platform.Communication.Protocol.Lino.Link.html)\>
```C#
(new Platform.Communication.Protocol.Lino.Parser()).Parse(@string)
```
### Formatting the [IList](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic.ilist-1)\<[Link](https://linksplatform.github.io/Communication.Protocol.Lino/csharp/api/Platform.Communication.Protocol.Lino.Link.html)\> back to string
```C#
using Platform.Communication.Protocol.Lino;
```
```C#
links.Format()
```

## [Documentation](https://linksplatform.github.io/Communication.Protocol.Lino)
*   Struct [Link](https://linksplatform.github.io/Communication.Protocol.Lino/csharp/api/Platform.Communication.Protocol.Lino.Link.html).
*   Method [Parser](https://linksplatform.github.io/Communication.Protocol.Lino/csharp/api/Platform.Communication.Protocol.Lino.Parser.html).[Parse](https://linksplatform.github.io/Communication.Protocol.Lino/csharp/api/Platform.Communication.Protocol.Lino.Parser.html#Platform_Communication_Protocol_Lino_Parser_Parse_System_String_System_String_)
*   Method [IListExtensions](https://linksplatform.github.io/Communication.Protocol.Lino/csharp/api/Platform.Communication.Protocol.Lino.IListExtensions.html).[Format](https://linksplatform.github.io/Communication.Protocol.Lino/csharp/api/Platform.Communication.Protocol.Lino.IListExtensions.html#Platform_Communication_Protocol_Lino_IListExtensions_Format_System_Collections_Generic_IList_Platform_Communication_Protocol_Lino_Link__)

[PDF file](https://linksplatform.github.io/Communication.Protocol.Lino/csharp/Platform.Communication.Protocol.Lino.pdf) with code for e-readers.

## Depend on
*   [Microsoft.CSharp](https://www.nuget.org/packages/Microsoft.CSharp)
*   [Pegasus](https://github.com/otac0n/Pegasus)
*   [Platform.Collections](https://github.com/linksplatform/Collections)

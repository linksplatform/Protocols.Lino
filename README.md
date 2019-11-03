[![NuGet Version and Downloads count](https://buildstats.info/nuget/Platform.Communication.Protocol.Lino)](https://www.nuget.org/packages/Platform.Communication.Protocol.Lino)
[![Actions Status](https://github.com/linksplatform/Communication.Protocol.Lino/workflows/CD/badge.svg)](https://github.com/linksplatform/Communication.Protocol.Lino/actions?workflow=CD)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c25f708dc08b4f7e8d96c671378bb1ad)](https://app.codacy.com/app/drakonard/Communication.Protocol.Lino?utm_source=github.com&utm_medium=referral&utm_content=linksplatform/Communication.Protocol.Lino&utm_campaign=Badge_Grade_Dashboard)
[![CodeFactor](https://www.codefactor.io/repository/github/linksplatform/Communication.Protocol.Lino/badge)](https://www.codefactor.io/repository/github/linksplatform/Communication.Protocol.Lino)

# [Communication.Protocol.Lino](https://github.com/linksplatform/Communication.Protocol.Lino)
LinksPlatform's Platform.Communication.Protocol.Lino Class Library.

This library gives you an ability to convert any string that contains links notation into a list of links and back to the strings after modifications are made.

Namespace: [Platform.Communication.Protocol.Lino](https://linksplatform.github.io/Communication.Protocol.Lino/api/Platform.Communication.Protocol.Lino.html)

NuGet package: [Platform.Communication.Protocol.Lino](https://www.nuget.org/packages/Platform.Communication.Protocol.Lino)

## Examples
### Links notation (lino):
```
(papa (lovesMama: loves mama))
(son lovesMama)
(daughter lovesMama)
(all (love mama))
```
### Getting a IList<Link>
```C#
(new Platform.Communication.Protocol.Lino.Parser()).Parse(@string)
```
### Formatting the IList<Link> back to string
```C#
links.Format()
```

## [Documentation](https://linksplatform.github.io/Communication.Protocol.Lino)
*   Struct [Link](https://linksplatform.github.io/Communication.Protocol.Lino/api/Platform.Communication.Protocol.Lino.Link.html).
*   Class [Parser](https://linksplatform.github.io/Communication.Protocol.Lino/api/Platform.Communication.Protocol.Lino.Parser.html).

[PDF file](https://linksplatform.github.io/Communication.Protocol.Lino/Platform.Communication.Protocol.Lino.pdf) with code for e-readers.

## Depend on
*   [Pegasus](https://github.com/otac0n/Pegasus)
*   [Platform.Collections](https://github.com/linksplatform/Collections)

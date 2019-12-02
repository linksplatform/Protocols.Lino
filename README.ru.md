[![Версия NuGet пакета и количество загрузок](https://buildstats.info/nuget/Platform.Communication.Protocol.Lino)](https://www.nuget.org/packages/Platform.Communication.Protocol.Lino)
[![Состояние сборки](https://github.com/linksplatform/Communication.Protocol.Lino/workflows/CD/badge.svg)](https://github.com/linksplatform/Communication.Protocol.Lino/actions?workflow=CD)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c25f708dc08b4f7e8d96c671378bb1ad)](https://app.codacy.com/app/drakonard/Communication.Protocol.Lino?utm_source=github.com&utm_medium=referral&utm_content=linksplatform/Communication.Protocol.Lino&utm_campaign=Badge_Grade_Dashboard)
[![CodeFactor](https://www.codefactor.io/repository/github/linksplatform/Communication.Protocol.Lino/badge)](https://www.codefactor.io/repository/github/linksplatform/Communication.Protocol.Lino)

# [Communication.Protocol.Lino](https://github.com/linksplatform/Communication.Protocol.Lino) ([english version](README.md))
Библиотека классов ПлатформыСвязей Platform.Communication.Protocol.Lino.

Эта библиотека дает вам возможность преобразовать любую строку, содержащую обозначение ссылок, в список ссылок и вернуться к строкам после внесения изменений.

Пространство имён: [Platform.Communication.Protocol.Lino](https://linksplatform.github.io/Communication.Protocol.Lino/api/Platform.Communication.Protocol.Lino.html)

NuGet пакет: [Platform.Communication.Protocol.Lino](https://www.nuget.org/packages/Platform.Communication.Protocol.Lino)

## Примеры
### Нотация связей
```
папа (любитМаму: любит маму)
сын любитМаму
дочь любитМаму
все (любят маму)
```
### Получаем [IList](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic.ilist-1)\<[Link](https://linksplatform.github.io/Communication.Protocol.Lino/api/Platform.Communication.Protocol.Lino.Link.html)\>
```C#
(new Platform.Communication.Protocol.Lino.Parser()).Parse(@string)
```
### Форматируем [IList](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic.ilist-1)\<[Link](https://linksplatform.github.io/Communication.Protocol.Lino/api/Platform.Communication.Protocol.Lino.Link.html)\> обратно в строку
```C#
using Platform.Communication.Protocol.Lino;
```
```C#
links.Format()
```

## [Документация](https://linksplatform.github.io/Communication.Protocol.Lino)
*   Структура [Link](https://linksplatform.github.io/Communication.Protocol.Lino/api/Platform.Communication.Protocol.Lino.Link.html).
*   Метод [Parser](https://linksplatform.github.io/Communication.Protocol.Lino/api/Platform.Communication.Protocol.Lino.Parser.html).[Parse](https://linksplatform.github.io/Communication.Protocol.Lino/api/Platform.Communication.Protocol.Lino.Parser.html#Platform_Communication_Protocol_Lino_Parser_Parse_System_String_System_String_)
*   Метод [IListExtensions](https://linksplatform.github.io/Communication.Protocol.Lino/api/Platform.Communication.Protocol.Lino.IListExtensions.html).[Format](https://linksplatform.github.io/Communication.Protocol.Lino/api/Platform.Communication.Protocol.Lino.IListExtensions.html#Platform_Communication_Protocol_Lino_IListExtensions_Format_System_Collections_Generic_IList_Platform_Communication_Protocol_Lino_Link__)

[PDF файл](https://linksplatform.github.io/Communication.Protocol.Lino/Platform.Communication.Protocol.Lino.pdf) с кодом для электронных книг.

## Зависит напрямую от
*   [Pegasus](https://github.com/otac0n/Pegasus)
*   [Platform.Collections](https://github.com/linksplatform/Collections)

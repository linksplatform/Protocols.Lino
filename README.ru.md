[![Версия NuGet пакета и количество загрузок](https://img.shields.io/nuget/v/Platform.Protocols.Lino?label=nuget&style=flat)](https://www.nuget.org/packages/Platform.Protocols.Lino)
[![Версия npm пакета и количество загрузок](https://img.shields.io/npm/v/@linksplatform/protocols-lino?label=npm&style=flat)](https://www.npmjs.com/package/@linksplatform/protocols-lino)
[![Версия Crates.io и количество загрузок](https://img.shields.io/crates/v/platform-lino?label=crates.io&style=flat)](https://crates.io/crates/platform-lino)
[![Состояние сборки](https://github.com/linksplatform/Protocols.Lino/workflows/CD/badge.svg)](https://github.com/linksplatform/Protocols.Lino/actions?workflow=CD)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4e7eb0a883e9439280c1097381d46b50)](https://app.codacy.com/gh/linksplatform/Protocols.Lino?utm_source=github.com&utm_medium=referral&utm_content=linksplatform/Protocols.Lino&utm_campaign=Badge_Grade_Settings)
[![CodeFactor](https://www.codefactor.io/repository/github/linksplatform/Protocols.Lino/badge)](https://www.codefactor.io/repository/github/linksplatform/Protocols.Lino)

# [Protocols.Lino](https://github.com/linksplatform/Protocols.Lino) ([english version](README.md))
Библиотека классов ПлатформыСвязей Platform.Protocols.Lino.

![introduction](https://github.com/linksplatform/Documentation/raw/master/doc/Examples/json_xml_lino_comparison/b%26w.png "сравнение json, xml и lino")

Эта библиотека дает вам возможность преобразовать любую строку, содержащую обозначение связей, в список связей и форматировать этот список обратно в строку после внесения изменений.

Нотация связей основана на двух концепциях: ссылка и связь. Каждая ссылка ссылается на другую связь. Нотация поддерживает связи с любым количеством ссылок на другие связи.

## Реализации для разных языков

Выберите предпочитаемый язык программирования для работы с Нотацией Связей:

- **[Реализация на C#](csharp/README.ru.md)** - Полнофункциональная .NET библиотека с NuGet пакетом
- **[Реализация на JavaScript](js/README.ru.md)** - Современная ES6+ реализация использующая Bun и Peggy.js  
- **[Реализация на Rust](rust/README.ru.md)** - Высокопроизводительный парсер использующий библиотеку комбинаторов nom

## Быстрый старт

### C#
```csharp
var parser = new Platform.Protocols.Lino.Parser();
var links = parser.Parse("папа (любитМаму: любит маму)");
```

### JavaScript
```javascript
import { Parser } from '@linksplatform/protocols-lino';
const parser = new Parser();
const links = parser.parse("папа (любитМаму: любит маму)");
```

### Rust
```rust
use lino::parse_lino;
let links = parse_lino("папа (любитМаму: любит маму)").unwrap();
```

## Примеры
### Нотация связей
```
папа (любитМаму: любит маму)
сын любитМаму
дочь любитМаму
все (любят маму)
```
## Что такое Нотация Связей?

Нотация Связей (Lino) - это простой, интуитивный формат для представления структурированных данных в виде связей между сущностями. Он разработан для того, чтобы быть:

- **Естественным**: Большинство текстов уже может быть распарсено как нотация связей
- **Гибким**: Поддерживает любое количество ссылок в каждой связи  
- **Универсальным**: Может представлять дублеты, триплеты и N-кортежи
- **Иерархическим**: Поддерживает вложенные структуры с отступами

Нотация использует две основные концепции:
- **Ссылки**: Указывают на другие связи (как переменные или идентификаторы)
- **Связи**: Соединяют ссылки вместе с опциональными идентификаторами

## Документация

Для подробных руководств по реализации и справочников API смотрите документацию для конкретных языков:

- **[Документация C#](https://linksplatform.github.io/Protocols.Lino/csharp/api/Platform.Protocols.Lino.html)** - Полный справочник API
- **[README C#](csharp/README.ru.md)** - Руководство по установке и использованию
- **[README JavaScript](js/README.ru.md)** - Руководство для современной веб-разработки  
- **[README Rust](rust/README.ru.md)** - Руководство по высокопроизводительному парсингу

Дополнительные ресурсы:
- [PDF Документация](https://linksplatform.github.io/Protocols.Lino/csharp/Platform.Protocols.Lino.pdf) - Полный справочник для офлайн чтения

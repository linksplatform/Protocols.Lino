# [Protocols.Lino](https://github.com/linksplatform/Protocols.Lino) (languages: [en](README.md) • ru)

| [![Состояние Actions](https://github.com/linksplatform/Protocols.Lino/workflows/js/badge.svg)](https://github.com/linksplatform/Protocols.Lino/actions?workflow=js) | [![Версия npm пакета и количество загрузок](https://img.shields.io/npm/v/@linksplatform/protocols-lino?label=npm&style=flat)](https://www.npmjs.com/package/@linksplatform/protocols-lino) | **[JavaScript](js/README.ru.md)** |
|:-|-:|:-|
| [![Состояние Actions](https://github.com/linksplatform/Protocols.Lino/workflows/rust/badge.svg)](https://github.com/linksplatform/Protocols.Lino/actions?workflow=rust) | [![Версия Crates.io и количество загрузок](https://img.shields.io/crates/v/platform-lino?label=crates.io&style=flat)](https://crates.io/crates/platform-lino) | **[Rust](rust/README.ru.md)** |
| [![Состояние Actions](https://github.com/linksplatform/Protocols.Lino/workflows/csharp/badge.svg)](https://github.com/linksplatform/Protocols.Lino/actions?workflow=csharp) | [![Версия NuGet пакета и количество загрузок](https://img.shields.io/nuget/v/Platform.Protocols.Lino?label=nuget&style=flat)](https://www.nuget.org/packages/Platform.Protocols.Lino) | **[C#](csharp/README.ru.md)** |

[![Gitpod](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/linksplatform/Protocols.Lino)
[![Open in GitHub Codespaces](https://img.shields.io/badge/GitHub%20Codespaces-Open-181717?logo=github)](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=linksplatform/Protocols.Lino)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/4e7eb0a883e9439280c1097381d46b50)](https://app.codacy.com/gh/linksplatform/Protocols.Lino?utm_source=github.com&utm_medium=referral&utm_content=linksplatform/Protocols.Lino&utm_campaign=Badge_Grade_Settings)
[![CodeFactor](https://www.codefactor.io/repository/github/linksplatform/Protocols.Lino/badge)](https://www.codefactor.io/repository/github/linksplatform/Protocols.Lino)

Библиотека классов ПлатформыСвязей Platform.Protocols.Lino.

![introduction](https://github.com/linksplatform/Documentation/raw/master/doc/Examples/json_xml_lino_comparison/b%26w.png "сравнение json, xml и lino")

Эта библиотека дает вам возможность преобразовать любую строку,
содержащую обозначение связей, в список связей и форматировать этот
список обратно в строку после внесения изменений.

Нотация связей основана на двух концепциях: ссылка и связь. Каждая
ссылка ссылается на другую связь. Нотация поддерживает связи с любым
количеством ссылок на другие связи.

## Быстрый старт

### C&#35;

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

#### Дуплеты (2-кортежи)

```lino
папа (любитМаму: любит маму)
сын любитМаму
дочь любитМаму
все (любят маму)
```

#### Триплеты (3-кортежи)

```lino
папа имеет машину
мама имеет дом
(папа и мама) счастливы
```

#### Последовательности (N-кортежи)

```lino
Я дружелюбный ИИ.
(Я тоже дружелюбный ИИ.)
(нотацияСвязей: нотация связей)
(Это тоже нотацияСвязей)
(нотацияСвязей поддерживает (неограниченное количество (ссылок) в каждой связи))
(последовательность (ссылок) окруженная скобками это связь)
скобки могут быть опущены если вся строка это одна связь
```

Это означает что *этот* текст тоже является нотацией связей. Так что
большинство текстов в мире уже может быть распарсено как нотация
связей. Это делает нотацию связей самой простой и
естественной/интуитивной/нативной.

## Что такое Нотация Связей?

Нотация Связей (Lino) - это простой, интуитивный формат для
представления структурированных данных в виде связей между ссылками на связи.
Он разработан для того, чтобы быть:

- **Естественным**: Большинство текстов уже может быть распарсено как нотация связей
- **Гибким**: Поддерживает любое количество ссылок в каждой связи  
- **Универсальным**: Может представлять дублеты, триплеты и N-кортежи
- **Иерархическим**: Поддерживает вложенные структуры с отступами

Нотация использует две основные концепции:

- **Ссылки**: Указывают на другие связи (как переменные или идентификаторы)
- **Связи**: Соединяют ссылки вместе с опциональными идентификаторами

## Документация

Для подробных руководств по реализации и справочников API смотрите
документацию для конкретных языков:

- **[Документация C#](https://linksplatform.github.io/Protocols.Lino/csharp/api/Platform.Protocols.Lino.html)**
  \- Полный справочник API
- **[README C#](csharp/README.ru.md)** - Руководство по установке и использованию
- **[README JavaScript](js/README.ru.md)** - Руководство для современной
  веб-разработки  
- **[README Rust](rust/README.ru.md)** - Руководство по
  высокопроизводительному парсингу

Дополнительные ресурсы:

- [PDF Документация](https://linksplatform.github.io/Protocols.Lino/csharp/Platform.Protocols.Lino.pdf)
  \- Полный справочник для офлайн чтения
- [Теория связей 0.0.2](https://habr.com/ru/articles/804617) -
  Теоретическая основа, которую Нотация Связей полностью поддерживает

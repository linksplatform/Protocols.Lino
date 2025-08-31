# Парсер протокола Lino для C#

Реализация парсера протокола Lino для C# с использованием генератора парсеров Pegasus и Platform.Collections.

## Установка

### Менеджер пакетов
```
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

## Сборка из исходного кода

Клонируйте репозиторий и соберите проект:

```bash
git clone https://github.com/linksplatform/Protocols.Lino.git
cd Protocols.Lino/csharp
dotnet build Platform.Protocols.Lino.sln
```

## Тестирование

Запуск тестов:

```bash
dotnet test
```

## Использование

### Базовый парсинг

```csharp
using Platform.Protocols.Lino;

// Создаем парсер
var parser = new Parser();

// Парсим строку в формате Lino
string input = @"папа (любитМаму: любит маму)
сын любитМаму
дочь любитМаму
все (любят маму)";

var links = parser.Parse(input);

// Обращение к распарсенным связям
foreach (var link in links)
{
    Console.WriteLine(link.ToString());
}
```

### Преобразование обратно в строку

```csharp
using Platform.Protocols.Lino;

// Форматирование связей обратно в строку
string formatted = links.Format();
Console.WriteLine(formatted);
```

### Работа со связями

```csharp
// Создание связи программно
var link = new Link<string>("идентификатор", new[] { "значение1", "значение2" });

// Доступ к свойствам связи
Console.WriteLine($"ID: {link.Id}");
foreach (var value in link.Values)
{
    Console.WriteLine($"Значение: {value}");
}
```

### Расширенное использование с универсальными типами

```csharp
// Использование числовых адресов связей
var parser = new Parser<ulong>();
var numericLinks = parser.Parse("(1: 2 3)");

// Работа с пользовательскими типами адресов
var customParser = new Parser<Guid>();
```

## Примеры синтаксиса

### Дуплеты (2-кортежи)
```
папа (любитМаму: любит маму)
сын любитМаму
дочь любитМаму
все (любят маму)
```

### Триплеты (3-кортежи)
```
папа имеет машину
мама имеет дом
(папа и мама) счастливы
```

### N-кортежи со ссылками
```
(нотацияСвязей: нотация связей)
(Это тоже нотацияСвязей)
(нотацияСвязей поддерживает (неограниченное количество (ссылок) в каждой связи))
```

## Справочник API

### Классы

- **Parser\<TLinkAddress\>**: Основной класс парсера для преобразования строк в связи
- **Link\<TLinkAddress\>**: Представляет одну связь с ID и значениями
- **LinksGroup\<TLinkAddress\>**: Контейнер для группировки связанных связей

### Методы расширения

- **IListExtensions.Format()**: Преобразует список связей обратно в строковый формат
- **ILinksGroupListExtensions**: Дополнительные операции для групп связей

## Зависимости

- .NET 8.0
- Microsoft.CSharp (4.7.0)
- Pegasus (4.1.0)
- Platform.Collections (0.3.2)

## Документация

Полная документация API: [Platform.Protocols.Lino Documentation](https://linksplatform.github.io/Protocols.Lino/csharp/api/Platform.Protocols.Lino.html)
using System;
using Xunit;

namespace Platform.Protocols.Lino.Tests
{
    public static class SingleLineParserTests
    {
        [Fact]
        public static void SingleLinkTest()
        {
            var source = @"(address: source target)";
            var parser = new Parser();
            var links = parser.Parse(source);
            var target = links.Format();
            Assert.Equal(source, target);
        }

        [Fact]
        public static void TripletSingleLinkTest()
        {
            var source = @"(papa has car)";
            var parser = new Parser();
            var links = parser.Parse(source);
            var target = links.Format();
            Assert.Equal(source, target);
        }

        [Fact]
        public static void BugTest1()
        {
            var source = @"(ignore conan-center-index repository)";
            var links = new Parser().Parse(source);
            var target = links.Format();
            Assert.Equal(source,target);
        }

        [Fact]
        public static void QuotedReferencesTest()
        {
            var source = @"(a: 'b' ""c"")";
            var target = @"(a: b c)";
            var parser = new Parser();
            var links = parser.Parse(source);
            var formattedLinks = links.Format();
            Assert.Equal(target, formattedLinks);
        }

        [Fact]
        public static void QuotedReferencesWithSpacesTest()
        {
            var source = @"('a a': 'b b' ""c c"")";
            var target = @"('a a': 'b b' 'c c')";
            var parser = new Parser();
            var links = parser.Parse(source);
            var formattedLinks = links.Format();
            Assert.Equal(target, formattedLinks);
        }

        [Fact]
        public static void ParseSimpleReferenceTest()
        {
            var source = "test";
            var parser = new Parser();
            var links = parser.Parse(source);
            Assert.NotNull(links);
            Assert.Single(links);
            // Simple reference without colon creates a link with that ID
            Assert.Equal("test", links[0].Id);
            // Values can be null for simple references
            Assert.True(links[0].Values == null || links[0].Values.Count == 0);
        }

        [Fact]
        public static void ParseReferenceWithColonAndValuesTest()
        {
            var source = "parent: child1 child2";
            var parser = new Parser();
            var links = parser.Parse(source);
            Assert.NotNull(links);
            Assert.Single(links);
            Assert.Equal("parent", links[0].Id);
            Assert.NotNull(links[0].Values);
            Assert.Equal(2, links[0].Values.Count);
            Assert.Equal("child1", links[0].Values[0].Id);
            Assert.Equal("child2", links[0].Values[1].Id);
        }

        [Fact]
        public static void ParseMultilineLinkTest()
        {
            var source = "(parent: child1 child2)";
            var parser = new Parser();
            var links = parser.Parse(source);
            Assert.NotNull(links);
            Assert.Single(links);
            Assert.Equal("parent", links[0].Id);
            Assert.NotNull(links[0].Values);
            Assert.Equal(2, links[0].Values.Count);
        }

        [Fact]
        public static void ParseValuesOnlyTest()
        {
            var source = ": value1 value2";
            var parser = new Parser();
            var links = parser.Parse(source);
            Assert.NotNull(links);
            Assert.Single(links);
            Assert.Null(links[0].Id);
            Assert.NotNull(links[0].Values);
            Assert.Equal(2, links[0].Values.Count);
            Assert.Equal("value1", links[0].Values[0].Id);
            Assert.Equal("value2", links[0].Values[1].Id);
        }

        [Fact]
        public static void TestPointLinkTest()
        {
            // Test point link
            var input = "(point)";
            var result = new Parser().Parse(input);
            Assert.NotEmpty(result);
        }

        [Fact]
        public static void TestValueLinkTest()
        {
            // Test value link
            var input = "(value1 value2 value3)";
            var result = new Parser().Parse(input);
            Assert.NotEmpty(result);
        }

        [Fact]
        public static void TestQuotedReferencesWithSpecialCharsTest()
        {
            // Test quoted references
            var input = @"(""id with spaces"": ""value with spaces"")";
            var result = new Parser().Parse(input);
            Assert.NotEmpty(result);
        }

        [Fact]
        public static void TestSingleQuotedReferencesTest()
        {
            // Test single-quoted references
            var input = "('id': 'value')";
            var result = new Parser().Parse(input);
            Assert.NotEmpty(result);
        }

        [Fact]
        public static void TestNestedLinksSingleLineTest()
        {
            // Test nested links
            var input = "(outer: (inner: value))";
            var result = new Parser().Parse(input);
            Assert.NotEmpty(result);
        }

        [Fact]
        public static void TestHyphenatedIdentifiersTest()
        {
            // Test support for hyphenated identifiers like in BugTest1
            var source = @"(conan-center-index: repository info)";
            var parser = new Parser();
            var links = parser.Parse(source);
            var target = links.Format();
            Assert.Equal(source, target);
        }

        [Fact]
        public static void TestMultipleWordsInQuotesTest()
        {
            var source = @"(""New York"": city state)";
            var parser = new Parser();
            var links = parser.Parse(source);
            var target = links.Format();
            // Should preserve quotes for multi-word references
            Assert.Contains("New York", target);
        }

        [Fact]
        public static void TestSpecialCharactersInQuotesTest()
        {
            var input = @"(""key:with:colons"": ""value(with)parens"")";
            var result = new Parser().Parse(input);
            Assert.NotEmpty(result);
            
            input = @"('key with spaces': 'value: with special chars')";
            result = new Parser().Parse(input);
            Assert.NotEmpty(result);
        }

        [Fact]
        public static void TestDeeplyNestedTest()
        {
            var input = "(a: (b: (c: (d: (e: value)))))";
            var result = new Parser().Parse(input);
            Assert.NotEmpty(result);
        }

        [Fact]
        public static void TestSingleLineWithIdTest()
        {
            // Test single-line link with id
            var input = "id: value1 value2";
            var result = new Parser().Parse(input);
            Assert.NotEmpty(result);
        }

        [Fact]
        public static void TestSingleLineWithoutIdTest()
        {
            // Test link without id (single-line)
            var input = ": value1 value2";
            var result = new Parser().Parse(input);
            Assert.NotEmpty(result);
        }

        [Fact]
        public static void TestMultilineWithoutIdTest()
        {
            // Test link without id (multi-line)
            var input = "(: value1 value2)";
            var result = new Parser().Parse(input);
            Assert.NotEmpty(result);
        }

        [Fact]
        public static void TestSimpleRefTest()
        {
            var input = "simple_ref";
            var result = new Parser().Parse(input);
            Assert.NotEmpty(result);
        }
    }
}
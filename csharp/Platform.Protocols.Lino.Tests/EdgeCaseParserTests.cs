using System;
using Xunit;

namespace Platform.Protocols.Lino.Tests
{
    public static class EdgeCaseParserTests
    {
        [Fact]
        public static void EmptyLinkTest()
        {
            var source = @":";
            var parser = new Parser();
            // Standalone ':' is now forbidden and should throw an exception
            Assert.Throws<FormatException>(() => parser.Parse(source));
        }

        [Fact]
        public static void EmptyLinkWithParenthesesTest()
        {
            var source = @"()";
            var target = @"()";
            var parser = new Parser();
            var links = parser.Parse(source);
            var formattedLinks = links.Format();
            Assert.Equal(target, formattedLinks);
        }

        [Fact]
        public static void EmptyLinkWithEmptySelfReferenceTest()
        {
            var source = @"(:)";
            var parser = new Parser();
            // '(:)' is now forbidden and should throw an exception
            Assert.Throws<FormatException>(() => parser.Parse(source));
        }

        [Fact]
        public static void TestAllFeaturesTest()
        {
            // Test single-line link with id
            var input = "id: value1 value2";
            var result = new Parser().Parse(input);
            Assert.NotEmpty(result);

            // Test multi-line link with id
            input = "(id: value1 value2)";
            result = new Parser().Parse(input);
            Assert.NotEmpty(result);

            // Test link without id (single-line) - now forbidden
            input = ": value1 value2";
            Assert.Throws<FormatException>(() => new Parser().Parse(input));

            // Test link without id (multi-line) - now forbidden
            input = "(: value1 value2)";
            Assert.Throws<FormatException>(() => new Parser().Parse(input));

            // Test singlet link
            input = "(singlet)";
            result = new Parser().Parse(input);
            Assert.NotEmpty(result);

            // Test value link
            input = "(value1 value2 value3)";
            result = new Parser().Parse(input);
            Assert.NotEmpty(result);

            // Test quoted references
            input = @"(""id with spaces"": ""value with spaces"")";
            result = new Parser().Parse(input);
            Assert.NotEmpty(result);

            // Test single-quoted references
            input = "('id': 'value')";
            result = new Parser().Parse(input);
            Assert.NotEmpty(result);

            // Test nested links
            input = "(outer: (inner: value))";
            result = new Parser().Parse(input);
            Assert.NotEmpty(result);
        }

        [Fact]
        public static void TestSingletLinks()
        {
            // Test singlet (1)
            var input = "(1)";
            var result = new Parser().Parse(input);
            Assert.Single(result);
            Assert.Equal("1", result[0].Id);
            Assert.Null(result[0].Values);

            // Test (1 2)
            input = "(1 2)";
            result = new Parser().Parse(input);
            Assert.Single(result);
            Assert.Null(result[0].Id);
            Assert.NotNull(result[0].Values);
            Assert.Equal(2, result[0].Values.Count);
            Assert.Equal("1", result[0].Values[0].Id);
            Assert.Equal("2", result[0].Values[1].Id);

            // Test (1 2 3)
            input = "(1 2 3)";
            result = new Parser().Parse(input);
            Assert.Single(result);
            Assert.Null(result[0].Id);
            Assert.NotNull(result[0].Values);
            Assert.Equal(3, result[0].Values.Count);
            Assert.Equal("1", result[0].Values[0].Id);
            Assert.Equal("2", result[0].Values[1].Id);
            Assert.Equal("3", result[0].Values[2].Id);

            // Test (1 2 3 4)
            input = "(1 2 3 4)";
            result = new Parser().Parse(input);
            Assert.Single(result);
            Assert.Null(result[0].Id);
            Assert.NotNull(result[0].Values);
            Assert.Equal(4, result[0].Values.Count);
            Assert.Equal("1", result[0].Values[0].Id);
            Assert.Equal("2", result[0].Values[1].Id);
            Assert.Equal("3", result[0].Values[2].Id);
            Assert.Equal("4", result[0].Values[3].Id);
        }

        [Fact]
        public static void TestEmptyDocumentTest()
        {
            var input = "";
            // Empty document should return empty list
            var result = new Parser().Parse(input);
            Assert.Empty(result);
        }

        [Fact]
        public static void TestWhitespaceOnlyTest()
        {
            var input = "   \n   \n   ";
            // Whitespace-only document should return empty list (similar to empty document)
            var result = new Parser().Parse(input);
            Assert.Empty(result);
        }

        [Fact]
        public static void TestEmptyLinksTest()
        {
            var input = "()";
            var result = new Parser().Parse(input);
            Assert.NotEmpty(result);
            
            // '(:)' is now forbidden
            input = "(:)";
            Assert.Throws<FormatException>(() => new Parser().Parse(input));
            
            input = "(id:)";
            result = new Parser().Parse(input);
            Assert.NotEmpty(result);
        }
    }
}
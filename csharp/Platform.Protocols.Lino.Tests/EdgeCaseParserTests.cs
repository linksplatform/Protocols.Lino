using System;
using Xunit;

namespace Platform.Protocols.Lino.Tests
{
    public static class EdgeCaseParserTests
    {
        [Fact(Skip = "Not implemented yet")]
        public static void EmptyLinkTest()
        {
            var source = @":";
            var target = @":";
            var parser = new Parser();
            var links = parser.Parse(source);
            var formattedLinks = links.Format();
            Assert.Equal(target, formattedLinks);
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
            var target = @"()";
            var parser = new Parser();
            var links = parser.Parse(source);
            var formattedLinks = links.Format();
            Assert.Equal(target, formattedLinks);
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

            // Test link without id (single-line)
            input = ": value1 value2";
            result = new Parser().Parse(input);
            Assert.NotEmpty(result);

            // Test link without id (multi-line)
            input = "(: value1 value2)";
            result = new Parser().Parse(input);
            Assert.NotEmpty(result);

            // Test point link
            input = "(point)";
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
        public static void TestEmptyDocumentTest()
        {
            var input = "";
            // C# parser throws exception for empty documents
            Assert.Throws<FormatException>(() => new Parser().Parse(input));
        }

        [Fact]
        public static void TestWhitespaceOnlyTest()
        {
            var input = "   \n   \n   ";
            // C# parser may not handle whitespace-only documents like Rust version
            // This is expected behavior difference
            Assert.Throws<FormatException>(() => new Parser().Parse(input));
        }

        [Fact]
        public static void TestEmptyLinksTest()
        {
            var input = "()";
            var result = new Parser().Parse(input);
            Assert.NotEmpty(result);
            
            input = "(:)";
            result = new Parser().Parse(input);
            Assert.NotEmpty(result);
            
            input = "(id:)";
            result = new Parser().Parse(input);
            Assert.NotEmpty(result);
        }
    }
}
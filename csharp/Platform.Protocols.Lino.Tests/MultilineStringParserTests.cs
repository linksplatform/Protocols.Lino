using Xunit;

namespace Platform.Protocols.Lino.Tests
{
    public static class MultilineStringParserTests
    {
        [Fact]
        public static void MultilineDoubleQuotedStringTest()
        {
            var parser = new Parser();
            var source = @"(""long
string literal representing
the reference"")";
            var links = parser.Parse(source);
            Assert.Equal(1, links.Count);
            Assert.Equal(null, links[0].Id);
            Assert.Equal(1, links[0].Values.Count);
            Assert.Equal("long\nstring literal representing\nthe reference", links[0].Values[0].Id);
        }

        [Fact]
        public static void MultilineSingleQuotedStringTest()
        {
            var parser = new Parser();
            var source = @"('another
long string literal 
as another reference')";
            var links = parser.Parse(source);
            Assert.Equal(1, links.Count);
            Assert.Equal(null, links[0].Id);
            Assert.Equal(1, links[0].Values.Count);
            Assert.Equal("another\nlong string literal \nas another reference", links[0].Values[0].Id);
        }

        [Fact]
        public static void Issue53ExampleTest()
        {
            var parser = new Parser();
            // Test the exact example from issue #53
            var source = @"(
  ""long
string literal representing
the reference""
  
  'another
long string literal 
as another reference'
)";
            var links = parser.Parse(source);
            Assert.Equal(1, links.Count);
            Assert.Equal(null, links[0].Id);
            Assert.Equal(2, links[0].Values.Count);
            Assert.Equal("long\nstring literal representing\nthe reference", links[0].Values[0].Id);
            Assert.Equal("another\nlong string literal \nas another reference", links[0].Values[1].Id);
        }

        [Fact]
        public static void MultilineStringWithIdTest()
        {
            var parser = new Parser();
            var source = @"(myId: ""first
multiline
value"" 'second
multiline
value')";
            var links = parser.Parse(source);
            Assert.Equal(1, links.Count);
            Assert.Equal("myId", links[0].Id);
            Assert.Equal(2, links[0].Values.Count);
            Assert.Equal("first\nmultiline\nvalue", links[0].Values[0].Id);
            Assert.Equal("second\nmultiline\nvalue", links[0].Values[1].Id);
        }

        [Fact]
        public static void MixedSingleAndMultilineStringTest()
        {
            var parser = new Parser();
            var source = @"(normal ""multi
line"" single)";
            var links = parser.Parse(source);
            Assert.Equal(1, links.Count);
            Assert.Equal(null, links[0].Id);
            Assert.Equal(3, links[0].Values.Count);
            Assert.Equal("normal", links[0].Values[0].Id);
            Assert.Equal("multi\nline", links[0].Values[1].Id);
            Assert.Equal("single", links[0].Values[2].Id);
        }

        [Fact]
        public static void SingleCharacterMultilineStringTest()
        {
            var parser = new Parser();
            var source = @"(""a"")";
            var links = parser.Parse(source);
            Assert.Equal(1, links.Count);
            Assert.Equal(null, links[0].Id);
            Assert.Equal(1, links[0].Values.Count);
            Assert.Equal("a", links[0].Values[0].Id);
        }
    }
}
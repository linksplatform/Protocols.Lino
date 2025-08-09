using System;
using Xunit;

namespace Platform.Protocols.Lino.Tests
{
    public static class NestedParserTests
    {
        [Fact]
        public static void SignificantWhitespaceTest()
        {
            var source = @"
users
    user1
        id
            43
        name
            first
                John
            last
                Williams
        location
            New York
        age
            23
    user2
        id
            56
        name
            first
                Igor
            middle
                Petrovich
            last
                Ivanov
        location
            Moscow
        age
            20";
            var target = @"(users)
(users user1)
((users user1) id)
(((users user1) id) 43)
((users user1) name)
(((users user1) name) first)
((((users user1) name) first) John)
(((users user1) name) last)
((((users user1) name) last) Williams)
((users user1) location)
(((users user1) location) (New York))
((users user1) age)
(((users user1) age) 23)
(users user2)
((users user2) id)
(((users user2) id) 56)
((users user2) name)
(((users user2) name) first)
((((users user2) name) first) Igor)
(((users user2) name) middle)
((((users user2) name) middle) Petrovich)
(((users user2) name) last)
((((users user2) name) last) Ivanov)
((users user2) location)
(((users user2) location) Moscow)
((users user2) age)
(((users user2) age) 20)";
            var parser = new Parser();
            var links = parser.Parse(source);
            var formattedLinks = links.Format();
            Assert.Equal(target, formattedLinks);
        }

        [Fact]
        public static void SimpleSignificantWhitespaceTest()
        {
            var source = @"a
    b
    c";
            var target = @"(a)
(a b)
(a c)";
            var parser = new Parser();
            var links = parser.Parse(source);
            var formattedLinks = links.Format();
            Assert.Equal(target, formattedLinks);
        }
        
        [Fact]
        public static void TwoSpacesSizedWhitespaceTest()
        {
            var source = @"
users
  user1";
            var target = @"(users)
(users user1)";
            var parser = new Parser();
            var links = parser.Parse(source);
            var formattedLinks = links.Format();
            Assert.Equal(target, formattedLinks);
        }

        [Fact]
        public static void ParseNestedStructureWithIndentationTest()
        {
            var source = @"parent
  child1
  child2";
            var parser = new Parser();
            var links = parser.Parse(source);
            Assert.NotNull(links);
            // Should create 3 links: (parent), (parent child1), (parent child2)
            Assert.Equal(3, links.Count);
        }

        [Fact]
        public static void TestIndentationConsistencyTest()
        {
            // Test that indentation must be consistent
            var input = @"parent
  child1
   child2"; // Inconsistent indentation
            var result = new Parser().Parse(input);
            // This should parse but child2 won't be a child of parent due to different indentation
            Assert.NotEmpty(result);
        }

        [Fact]
        public static void IndentationBasedChildrenTest()
        {
            var input = @"parent
  child1
  child2
    grandchild";
            var parser = new Parser();
            var result = parser.Parse(input);
            Assert.NotNull(result);
            // Expected flattened links:
            // (parent), (parent child1), (parent child2), ((parent child2) grandchild)
            Assert.Equal(4, result.Count);
        }

        [Fact]
        public static void ComplexIndentationTest()
        {
            var input = @"root
  level1a
    level2a
    level2b
  level1b
    level2c";
            var parser = new Parser();
            var result = parser.Parse(input);
            Assert.NotNull(result);
            // Expected flattened links:
            // (root), (root level1a), ((root level1a) level2a), ((root level1a) level2b),
            // (root level1b), ((root level1b) level2c)
            Assert.Equal(6, result.Count);
        }
    }
}
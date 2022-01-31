using Xunit;

namespace Platform.Communication.Protocol.Lino.Tests
{
    public static class ParserTests
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
        public static void TwoLinksTest()
        {
            var source = @"(first: x y)
(second: a b)";
            var parser = new Parser();
            var links = parser.Parse(source);
            var target = links.Format();
            Assert.Equal(source, target);
        }

        [Fact]
        public static void ParseAndStringifyTest()
        {
            var source = @"(papa (lovesMama: loves mama))
(son lovesMama)
(daughter lovesMama)
(all (love mama))";
            var parser = new Parser();
            var links = parser.Parse(source);
            var target = links.Format();
            Assert.Equal(source, target);
        }
        
        [Fact]
        public static void BugTest()
        {
            var source = @"(ignore conan-center-index repository)";
            var links = (new Platform.Communication.Protocol.Lino.Parser()).Parse(source);
            var target = links.Format();
            Assert.Equal(source,target);
        }

        [Fact]
        public static void ParseAndStringifyWithLessParenthesesTest()
        {
            var source = @"lovesMama: loves mama
papa lovesMama
son lovesMama
daughter lovesMama
all (love mama)";
            var parser = new Parser();
            var links = parser.Parse(source);
            var target = links.Format(lessParentheses: true);
            Assert.Equal(source, target);
        }

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
    }
}

using System.Collections.Generic;
using Xunit;

namespace Platform.Communication.Protocol.Lino.Tests
{
    public class TupleTests
    {
        [Fact]
        public void TupleToLinkTest()
        {
            var source = @"(papa (lovesMama: loves mama))
(son lovesMama)
(daughter lovesMama)
(all (loveMama: love mama))
(papa son daughter)";
            var parser = new Parser();
            var links = parser.Parse(source);
            var targetFromString = links.Format();

            IList<Link> constructedLinks = new List<Link>()
            {
                ("papa", (_)("lovesMama", "loves", "mama")),
                ("son", "lovesMama"),
                ("daughter", "lovesMama"),
                ("all", (_)("loveMama", "love", "mama")),
                ("papa", "son", "daughter")
            };
            var targetFromTuples = constructedLinks.Format();
            Assert.Equal(targetFromString, targetFromTuples);
        }
    }
}

using System.Collections.Generic;
using Xunit;

namespace Platform.Communication.Protocol.Lino.Tests
{
    /// <summary>
    /// <para>
    /// Represents the tuple tests.
    /// </para>
    /// <para></para>
    /// </summary>
    public class TupleTests
    {
        /// <summary>
        /// <para>
        /// Tests that tuple to link test.
        /// </para>
        /// <para></para>
        /// </summary>
        [Fact]
        public void TupleToLinkTest()
        {
            var source = @"(papa (lovesMama: loves mama))
(son lovesMama)
(daughter lovesMama)
(all (love mama))";
            var parser = new Parser();
            var links = parser.Parse(source);
            var targetFromString = links.Format();

            IList<Link> constructedLinks = new List<Link>()
            {
                ("papa", (_)("lovesMama", "loves", "mama")),
                ("son", "lovesMama"),
                ("daughter", "lovesMama"),
                ("all", ("love", "mama")),
            };
            var targetFromTuples = constructedLinks.Format();
            Assert.Equal(targetFromString, targetFromTuples);
        }
    }
}

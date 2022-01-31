using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Platform.Collections;
using Platform.Collections.Lists;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Platform.Protocols.Lino
{
    public struct LinksGroup : IEquatable<LinksGroup>
    {
        public Link Link
        {
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            get;
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            set;
        }

        public IList<LinksGroup> Groups
        {
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            get;
            [MethodImpl(MethodImplOptions.AggressiveInlining)]
            set;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public LinksGroup(Link link, IList<LinksGroup> groups)
        {
            Link = link;
            Groups = groups;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public LinksGroup(Link link) : this(link, null) { }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator List<Link>(LinksGroup value) => value.ToLinksList();

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public List<Link> ToLinksList()
        {
            var list = new List<Link>();
            AppendToLinksList(list);
            return list;
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public void AppendToLinksList(List<Link> list) => AppendToLinksList(list, Link, this);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static void AppendToLinksList(List<Link> list, Link dependency, LinksGroup group)
        {
            list.Add(dependency);
            var groups = group.Groups;
            if (!groups.IsNullOrEmpty())
            {
                for (int i = 0; i < groups.Count; i++)
                {
                    var innerGroup = groups[i];
                    AppendToLinksList(list, dependency.Combine(innerGroup.Link), innerGroup);
                }
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public override bool Equals(object obj) => obj is LinksGroup linksGroup ? Equals(linksGroup) : false;

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public override int GetHashCode() => (Link, Groups.GenerateHashCode()).GetHashCode();

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public bool Equals(LinksGroup other) => Link == other.Link && Groups.EqualTo(other.Groups);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static bool operator ==(LinksGroup left, LinksGroup right) => left.Equals(right);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static bool operator !=(LinksGroup left, LinksGroup right) => !(left == right);
    }
}

using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;
using Platform.Collections;
using Platform.Collections.Lists;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

namespace Platform.Communication.Protocol.Lino
{
    public struct Link : IEquatable<Link>
    {
        public readonly string Id;

        public readonly IList<Link> Values;

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public Link(string id, IList<Link> values) => (Id, Values) = (id, values);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public Link(IList<Link> values) : this(null, values) { }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public Link(params Link[] values) : this(null, values) { }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public Link(string id) : this(id, null) { }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public override string ToString() => Values.IsNullOrEmpty() ? $"({Id})" : GetLinkValuesString();

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        private string GetLinkValuesString() => Id == null ? $"({GetValuesString()})" : $"({Id}: {GetValuesString()})";

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public string GetValuesString()
        {
            var sb = new StringBuilder();
            for (int i = 0; i < Values.Count; i++)
            {
                if (i > 0)
                {
                    sb.Append(' ');
                }
                sb.Append(GetValueString(Values[i]));
            }
            return sb.ToString();
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public Link Simplify()
        {
            if (Values.IsNullOrEmpty())
            {
                return this;
            }
            else if (Values.Count == 1)
            {
                return Values[0];
            }
            else
            {
                var newValues = new Link[Values.Count];
                for (int i = 0; i < Values.Count; i++)
                {
                    newValues[i] = Values[i].Simplify();
                }
                return new Link(Id, newValues);
            }
        }

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public Link Combine(Link other) => new Link(this, other);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static string GetValueString(Link value) => value.ToLinkOrIdString();

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public string ToLinkOrIdString() => Values.IsNullOrEmpty() ? Id : ToString();

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator Link(string value) => new Link(value);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator Link((string, IList<Link>) value) => new Link(value.Item1, value.Item2);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator Link((Link, Link) value) => new Link(value.Item1, value.Item2);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator Link((Link, Link, Link) value) => new Link(value.Item1, value.Item2, value.Item3);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator Link((_, _) value) => new Link(value.Item1.Link, value.Item2.Link);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator Link((_, _, _) value) => new Link(value.Item1.Link, value.Item2.Link, value.Item3.Link);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public override bool Equals(object obj) => obj is Link link ? Equals(link) : false;

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public override int GetHashCode() => (Id, Values.GenerateHashCode()).GetHashCode();

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public bool Equals(Link other) => Id == other.Id && Values.EqualTo(other.Values);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static bool operator ==(Link left, Link right) => left.Equals(right);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static bool operator !=(Link left, Link right) => !(left == right);
    }
}

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member

using System.Runtime.CompilerServices;

namespace Platform.Communication.Protocol.Lino
{
    public struct _
    {
        public readonly Link Link;

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public _(Link id) => Link = id;

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator _(Link value) => new _(value);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator _(string id) => new _(id);

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator _((string, Link) value) => new Link(value.Item1, new Link[] { value.Item2 });

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator _((string, Link, Link) value) => new Link(value.Item1, new Link[] { value.Item2, value.Item3 });

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public static implicit operator _((string, Link, Link, Link) value) => new Link(value.Item1, new Link[] { value.Item2, value.Item3, value.Item4 });
    }
}

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowUpRight, FileText, ImagePlus, Link2, LogOut, MessageCircle, PenLine, Share2, Trash2, X } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Post = { id: string; title: string; category: string; excerpt: string; content: string; cover_url: string | null; pdf_url: string | null; pdf_name: string | null; created_at: string };
type Comment = { id: string; post_id: string; author_name: string; body: string; created_at: string };
type Reaction = { post_id: string; kind: string; visitor_id: string };

const REACTIONS = [
  { kind: "like", emoji: "👍", label: "Like" },
  { kind: "love", emoji: "❤️", label: "Love" },
  { kind: "insightful", emoji: "💡", label: "Insightful" },
  { kind: "fire", emoji: "🔥", label: "Fire" },
] as const;
const CATEGORIES = ["General", "System Design", "AI / ML", "Web Development", "Learning Notes"];
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

function getVisitorId() {
  let id = localStorage.getItem("sourov-visitor");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("sourov-visitor", id); }
  return id;
}
const fmtDate = (d: string) => new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
const readTime = (t: string) => Math.max(1, Math.round(t.split(/\s+/).length / 200));

async function uploadFile(file: File) {
  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const { error } = await supabase.storage.from("blog-media").upload(path, file, { contentType: file.type });
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("blog-media").createSignedUrl(path, TEN_YEARS);
  if (e2 || !data) throw e2 ?? new Error("No URL");
  return data.signedUrl;
}

export function BlogSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [visitor, setVisitor] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const load = useCallback(async () => {
    const [p, c, r] = await Promise.all([
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("blog_comments").select("*").order("created_at", { ascending: true }),
      supabase.from("blog_reactions").select("post_id, kind, visitor_id"),
    ]);
    setPosts((p.data as Post[]) ?? []);
    setComments((c.data as Comment[]) ?? []);
    setReactions((r.data as Reaction[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    setVisitor(getVisitorId());
    void load();
    const m = window.location.hash.match(/^#post-(.+)$/);
    if (m) setOpenId(m[1]);
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [load]);

  useEffect(() => {
    if (!session) { setIsAdmin(false); return; }
    supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  useEffect(() => {
    if (!openId && !showAuth && !showEditor) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpenId(null); setShowAuth(false); setShowEditor(false); } };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [openId, showAuth, showEditor]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);
  const visible = filter === "All" ? posts : posts.filter((p) => p.category === filter);
  const openPost = posts.find((p) => p.id === openId) ?? null;

  const react = async (postId: string, kind: string) => {
    if (reactions.some((r) => r.post_id === postId && r.kind === kind && r.visitor_id === visitor)) return;
    setReactions((rs) => [...rs, { post_id: postId, kind, visitor_id: visitor }]);
    const { error } = await supabase.from("blog_reactions").insert({ post_id: postId, kind, visitor_id: visitor });
    if (error) void load();
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    setOpenId(null);
    void load();
  };

  return (
    <section id="blog" className="content-section blog-section">
      <div className="section-heading">
        <p className="eyebrow">07 / Blog</p>
        <h2>Notes from the learning path.</h2>
        <p className="section-aside">Thoughts on systems, code, and AI — written as I learn.</p>
      </div>

      <div className="blog-toolbar">
        <div className="project-filters" role="tablist" aria-label="Filter blog posts">
          {categories.map((c) => (
            <button key={c} type="button" role="tab" aria-selected={filter === c} className={`project-filter ${filter === c ? "is-active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>
        <div className="blog-admin-actions">
          {isAdmin && <button type="button" className="blog-write-btn" onClick={() => setShowEditor(true)}><PenLine /> Write a post</button>}
          {session
            ? <button type="button" className="blog-ghost-btn" onClick={() => supabase.auth.signOut()}><LogOut /> Sign out</button>
            : <button type="button" className="blog-ghost-btn" onClick={() => setShowAuth(true)}>Author login</button>}
        </div>
      </div>

      {loading ? <p className="blog-empty">Loading posts…</p> : visible.length === 0 ? <p className="blog-empty">No posts yet.</p> : (
        <div className="blog-grid" key={filter}>
          {visible.map((p) => {
            const count = reactions.filter((r) => r.post_id === p.id).length;
            const cc = comments.filter((c) => c.post_id === p.id).length;
            return (
              <article key={p.id} className="blog-card" onClick={() => setOpenId(p.id)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setOpenId(p.id)}>
                <div className={`blog-card-media${p.cover_url ? "" : " is-empty"}`}>
                  {p.cover_url ? <img src={p.cover_url} alt="" loading="lazy" /> : <span>{p.title.charAt(0)}</span>}
                  <em>{p.category}</em>
                </div>
                <div className="blog-card-body">
                  <p className="blog-meta">{fmtDate(p.created_at)} · {readTime(p.content)} min read{p.pdf_url && <> · <FileText /> PDF</>}</p>
                  <h3>{p.title}</h3>
                  <p className="blog-excerpt">{p.excerpt}</p>
                  <div className="blog-card-foot"><span>❤️ {count}</span><span><MessageCircle /> {cc}</span><b>Read <ArrowUpRight /></b></div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {openPost && (
        <PostReader post={openPost} comments={comments.filter((c) => c.post_id === openPost.id)} reactions={reactions.filter((r) => r.post_id === openPost.id)}
          visitor={visitor} isAdmin={isAdmin} onReact={react} onClose={() => { setOpenId(null); if (location.hash.startsWith("#post-")) history.replaceState(null, "", "#blog"); }}
          onDelete={() => deletePost(openPost.id)} onCommented={load} />
      )}
      {showAuth && <AuthDialog onClose={() => setShowAuth(false)} />}
      {showEditor && <EditorDialog onClose={() => setShowEditor(false)} onSaved={() => { setShowEditor(false); void load(); }} />}
    </section>
  );
}

function PostReader({ post, comments, reactions, visitor, isAdmin, onReact, onClose, onDelete, onCommented }: {
  post: Post; comments: Comment[]; reactions: Reaction[]; visitor: string; isAdmin: boolean;
  onReact: (id: string, kind: string) => void; onClose: () => void; onDelete: () => void; onCommented: () => void;
}) {
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/#post-${post.id}` : "";
  const enc = encodeURIComponent(url);
  const text = encodeURIComponent(post.title);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setSending(true);
    await supabase.from("blog_comments").insert({ post_id: post.id, author_name: name.trim().slice(0, 60), body: body.trim().slice(0, 1000) });
    setBody(""); setSending(false); onCommented();
  };
  const nativeShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: post.title, url }); } catch { /* cancelled */ } }
    else { await navigator.clipboard?.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); }
  };
  const delComment = async (id: string) => { await supabase.from("blog_comments").delete().eq("id", id); onCommented(); };

  return (
    <div className="blog-modal" role="dialog" aria-modal="true" aria-label={post.title} onClick={onClose}>
      <article className="blog-reader" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="blog-close" onClick={onClose} aria-label="Close"><X /></button>
        {post.cover_url && <img className="blog-reader-cover" src={post.cover_url} alt="" />}
        <div className="blog-reader-inner">
          <p className="blog-meta">{post.category} · {fmtDate(post.created_at)} · {readTime(post.content)} min read</p>
          <h2>{post.title}</h2>
          <div className="blog-content">{post.content.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}</div>
          {post.pdf_url && (
            <a className="blog-pdf" href={post.pdf_url} target="_blank" rel="noopener noreferrer"><FileText /><span><b>{post.pdf_name ?? "Attachment.pdf"}</b><small>Open PDF</small></span><ArrowUpRight /></a>
          )}

          <div className="blog-reactions">
            {REACTIONS.map((r) => {
              const n = reactions.filter((x) => x.kind === r.kind).length;
              const mine = reactions.some((x) => x.kind === r.kind && x.visitor_id === visitor);
              return <button key={r.kind} type="button" className={mine ? "is-mine" : ""} onClick={() => onReact(post.id, r.kind)} aria-label={r.label} title={r.label}><span>{r.emoji}</span>{n}</button>;
            })}
          </div>

          <div className="blog-share">
            <span>Share</span>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={`https://wa.me/?text=${text}%20${enc}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href={`https://twitter.com/intent/tweet?text=${text}&url=${enc}`} target="_blank" rel="noopener noreferrer">X</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`} target="_blank" rel="noopener noreferrer">Facebook</a>
            <button type="button" onClick={nativeShare}>{copied ? "Copied!" : <><Share2 /> More</>}</button>
            <button type="button" onClick={async () => { await navigator.clipboard?.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); }}><Link2 /> Copy link</button>
          </div>

          {isAdmin && <button type="button" className="blog-danger" onClick={onDelete}><Trash2 /> Delete post</button>}

          <div className="blog-comments">
            <h3>Comments ({comments.length})</h3>
            {comments.map((c) => (
              <div key={c.id} className="blog-comment">
                <div className="blog-avatar">{c.author_name.charAt(0).toUpperCase()}</div>
                <div><p><b>{c.author_name}</b> <small>{fmtDate(c.created_at)}</small></p><p>{c.body}</p></div>
                {isAdmin && <button type="button" onClick={() => delComment(c.id)} aria-label="Delete comment"><Trash2 /></button>}
              </div>
            ))}
            <form onSubmit={submit} className="blog-comment-form">
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Your name" required />
              <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={1000} rows={3} placeholder="Write a comment…" required />
              <button type="submit" disabled={sending}>{sending ? "Posting…" : "Post comment"}</button>
            </form>
          </div>
        </div>
      </article>
    </div>
  );
}

function AuthDialog({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message); else onClose();
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
      if (error) setMsg(error.message);
      else if (!data.session) setMsg("Check your inbox to confirm your email, then sign in.");
      else onClose();
    }
    setBusy(false);
  };

  return (
    <div className="blog-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <form className="blog-dialog" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <button type="button" className="blog-close" onClick={onClose} aria-label="Close"><X /></button>
        <h3>{mode === "in" ? "Author sign in" : "Create author account"}</h3>
        <p className="blog-muted">Only the site owner can publish posts.</p>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete={mode === "in" ? "current-password" : "new-password"} /></label>
        {msg && <p className="blog-muted" role="status">{msg}</p>}
        <button type="submit" className="blog-write-btn" disabled={busy}>{busy ? "Please wait…" : mode === "in" ? "Sign in" : "Sign up"}</button>
        <button type="button" className="blog-link-btn" onClick={() => setMode(mode === "in" ? "up" : "in")}>{mode === "in" ? "First time? Create the account" : "Have an account? Sign in"}</button>
      </form>
    </div>
  );
}

function EditorDialog({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("General");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const preview = useMemo(() => (cover ? URL.createObjectURL(cover) : null), [cover]);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setErr(null);
    try {
      const cover_url = cover ? await uploadFile(cover) : null;
      const pdf_url = pdf ? await uploadFile(pdf) : null;
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("blog_posts").insert({
        title: title.trim(), category, excerpt: excerpt.trim() || content.trim().slice(0, 180), content: content.trim(),
        cover_url, pdf_url, pdf_name: pdf?.name ?? null, author_id: u.user?.id ?? null,
      });
      if (error) throw error;
      onSaved();
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Could not publish the post.");
    }
    setBusy(false);
  };

  return (
    <div className="blog-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <form className="blog-dialog blog-editor" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <button type="button" className="blog-close" onClick={onClose} aria-label="Close"><X /></button>
        <h3>New blog post</h3>
        <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} required minLength={3} maxLength={160} /></label>
        <label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label>Short summary<input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} maxLength={240} placeholder="Shown on the card (optional)" /></label>
        <label>Content<textarea value={content} onChange={(e) => setContent(e.target.value)} rows={9} required placeholder="Write your post. Leave a blank line between paragraphs." /></label>
        <div className="blog-uploads">
          <label className="blog-drop">
            {preview ? <img src={preview} alt="Cover preview" /> : <><ImagePlus /><span>Cover image</span></>}
            <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} />
          </label>
          <label className="blog-drop">
            <FileText /><span>{pdf ? pdf.name : "Attach PDF"}</span>
            <input type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        {err && <p className="blog-muted" role="alert">{err}</p>}
        <button type="submit" className="blog-write-btn" disabled={busy}>{busy ? "Publishing…" : "Publish post"}</button>
      </form>
    </div>
  );
}

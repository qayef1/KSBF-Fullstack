import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Works from "./pages/Works";
import Login from "./pages/Login";
import ArticleDetail from "./pages/ArticleDetail";
import Contact from "./pages/Contact";
import Breaches from "./pages/Breaches";

function Home(props) {
    return (
        <main>
            <section className="mb-16 mt-20">
                <p className="text-2xl leading-relaxed sm:text-3xl">
                    <span className="bg-white px-2 py-1 font-semibold text-black">
                        knowledge should be free
                    </span>
                    {" "}and there is no limitation to what you study.
                </p>
            </section>
            <section className="mb-16" id="intro">
                <h2 className="mb-5 font-semibold">
                    イントロ
                </h2>
                <p className="leading-relaxed">
                    i have been a neurodivergent since i was a kid.
                    even when i was still in elementary school, some people
                    called me a weirdo (not-in-a-bad-way). well on this website
                    of mine, there will be various work that this weirdo has
                    done (mostly about hacking stuff).
                </p>
            </section>
            <section className="mb-16" id="works">
                <h2 className="mb-5 text-xl font-semibold">
                    <a href="/works" onClick={(event) => props.onNavigate(event, "/works")}>works</a>
                </h2>
                <div className="grid grid-cols-1 gap-6">
                    {props.articles.map((article) => (
                        <article key={article.id}>
                            <a
                                href={article.link}
                                onClick={(event) => props.onNavigate(event, article.link)}
                                className="flex items-center gap-3"
                            >
                                {article.image ? (
                                    <img
                                        src={article.image}
                                        alt=""
                                        className="h-5 w-5 shrink-0"
                                    />
                                ) : (
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                                        📄
                                    </span>
                                )}
                                {article.title}
                            </a>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}

function App() {
    const [path, setPath] = useState(window.location.pathname);
    const [articles, setArticles] = useState([
        {
            id: 1,
            title: "how i hacked bernadya's x account",
            image: "/images/x-logo.png",
            link: "/article-detail.html"
        }
    ]);
    const [judulBaru, setJudulBaru] = useState("");
    const [ringkasanBaru, setRingkasanBaru] = useState("");
    const [isiBaru, setIsiBaru] = useState("");
    const [gambarBaru, setGambarBaru] = useState("");
    const [pesan, setPesan] = useState("");

    function navigate(event, halaman) {
        event.preventDefault();
        window.history.pushState({}, "", halaman);
        setPath(halaman);
    }

    useEffect(() => {
        function handleBack() {
            setPath(window.location.pathname);
        }

        window.addEventListener("popstate", handleBack);
        return () => window.removeEventListener("popstate", handleBack);
    }, []);

    useEffect(() => {
        async function ambilArtikel() {
            try {
                const response = await fetch("http://localhost:3001/articles");
                if (!response.ok) {
                    throw new Error("Gagal mengambil artikel.");
                }

                const data = await response.json();
                const artikelBackend = data.map((article) => ({
                    ...article,
                    link: "/article/" + article.id
                }));

                setArticles([
                    {
                        id: 1,
                        title: "how i hacked bernadya's x account",
                        image: "/images/x-logo.png",
                        link: "/article-detail.html"
                    },
                    ...artikelBackend
                ]);
            } catch {
                setPesan("Gagal mengambil artikel dari backend.");
            }
        }

        ambilArtikel();
    }, []);

    const [editId, setEditId] = useState(null);

    async function tambahArtikel(event) {
        event.preventDefault();

        if (judulBaru.trim() === "" || isiBaru.trim() === "") {
            return;
        }

        try {
            const response = await fetch(
                editId === null
                    ? "http://localhost:3001/articles"
                    : "http://localhost:3001/articles/" + editId,
                {
                    method: editId === null ? "POST" : "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: judulBaru,
                        summary: ringkasanBaru,
                        content: isiBaru,
                        image: gambarBaru
                    })
                }
            );

            const data = await response.json();
            if (!response.ok) {
                setPesan(Array.isArray(data.message) ? data.message.join(", ") : data.message);
                return;
            }

            const artikel = { ...data, link: "/article/" + data.id };
            if (editId === null) {
                setArticles([...articles, artikel]);
                setPesan("Artikel berhasil ditambahkan.");
            } else {
                setArticles(articles.map((item) => item.id === editId ? artikel : item));
                setPesan("Artikel berhasil diubah.");
            }

            setEditId(null);
            setJudulBaru("");
            setRingkasanBaru("");
            setIsiBaru("");
            setGambarBaru("");
        } catch {
            setPesan("Gagal terhubung ke backend.");
        }
    }

    function editArtikel(article) {
        setEditId(article.id);
        setJudulBaru(article.title);
        setRingkasanBaru(article.summary || "");
        setIsiBaru(article.content);
        setGambarBaru(article.image || "");
        setPesan("");
    }

    async function hapusArtikel(id) {
        try {
            const response = await fetch("http://localhost:3001/articles/" + id, {
                method: "DELETE"
            });
            if (!response.ok) {
                setPesan("Gagal menghapus artikel.");
                return;
            }

            setArticles(articles.filter((article) => article.id !== id));
            setPesan("Artikel berhasil dihapus.");
        } catch {
            setPesan("Gagal terhubung ke backend.");
        }
    }

    let artikelDipilih = null;
    for (let i = 0; i < articles.length; i++) {
        if (articles[i].link === path && articles[i].id !== 1) {
            artikelDipilih = articles[i];
        }
    }

    return (
        <div className="min-h-screen bg-black text-gray-200">
            <div className="mx-auto w-11/12 max-w-6xl">
                <Navbar onNavigate={navigate} />

                {path === "/" && <Home articles={articles} onNavigate={navigate} />}
                {path === "/works" && <Works articles={articles} onNavigate={navigate} />}
                {path === "/article-detail.html" && <ArticleDetail onNavigate={navigate} />}
                {path === "/contact" && <Contact />}
                {path === "/breaches" && <Breaches />}
                {path === "/admin" && (
                    <Login
                        judulBaru={judulBaru}
                        setJudulBaru={setJudulBaru}
                        ringkasanBaru={ringkasanBaru}
                        setRingkasanBaru={setRingkasanBaru}
                        isiBaru={isiBaru}
                        setIsiBaru={setIsiBaru}
                        gambarBaru={gambarBaru}
                        setGambarBaru={setGambarBaru}
                        tambahArtikel={tambahArtikel}
                        pesan={pesan}
                        setPesan={setPesan}
                        onNavigate={navigate}
                        editId={editId}
                        articles={articles.filter((article) => article.id !== 1)}
                        editArtikel={editArtikel}
                        hapusArtikel={hapusArtikel}
                    />
                )}
                {artikelDipilih && <ArticleDetail article={artikelDipilih} onNavigate={navigate} />}
            </div>
        </div>
    );
}

export default App;
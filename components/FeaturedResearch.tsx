import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { ArrowRight, BookOpen, ShieldAlert } from 'lucide-react';

export const FeaturedResearch: React.FC = () => {
    // Get latest 3 blog posts
    const recentPosts = blogPosts.slice(0, 3);

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container-progressive relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-accent-primary font-mono text-[10px] uppercase tracking-[0.4em] font-black">
                            <ShieldAlert size={14} />
                            <span>Technical Intelligence</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-orbitron font-[800] tracking-tighter text-text-primary uppercase italic">
                            LATEST <span className="text-accent-primary">RESEARCH</span>
                        </h2>
                    </div>
                    <Link
                        to="/blog"
                        className="group flex items-center gap-3 text-text-muted hover:text-accent-primary transition-colors font-orbitron font-bold text-xs tracking-[0.3em] uppercase"
                    >
                        Access Repository <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {recentPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link to={`/blog/${post.slug}`} className="group block h-full">
                                <div className="h-full flex flex-col border border-border-color transition-all duration-500 overflow-hidden rounded-3xl"
                                    style={{ background: 'var(--bg-card)' }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary-faded)'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                                    {/* Image Container */}
                                    <div className="relative aspect-[16/9] overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary-fallback/80 via-transparent to-transparent" />
                                        <div className="absolute bottom-4 left-4">
                                            <span className="px-3 py-1 bg-accent-primary/90 backdrop-blur-md text-white text-[8px] font-mono font-black uppercase tracking-widest rounded-md">
                                                {post.tags[0]}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow space-y-4">
                                        <div className="flex items-center gap-4 text-[9px] font-mono text-text-muted font-bold uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><BookOpen size={10} className="text-accent-primary" /> {post.readingTime}</span>
                                            <span>{post.publishDate}</span>
                                        </div>

                                        <h3 className="text-lg font-orbitron font-black text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2 leading-tight uppercase italic">
                                            {post.title}
                                        </h3>

                                        <p className="text-sm text-text-muted line-clamp-3 font-medium leading-relaxed flex-grow">
                                            {post.excerpt}
                                        </p>

                                        <div className="pt-4 flex items-center gap-2 text-accent-primary font-mono text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 text-right justify-end">
                                            DECRYPT ARTICLE <ArrowRight size={12} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

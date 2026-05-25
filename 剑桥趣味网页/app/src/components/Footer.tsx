import { Link } from 'react-router-dom';
import { Diamond, Star, BookOpen, Swords, MapPin, Trophy, Users } from 'lucide-react';
import { memo } from 'react';

const FloatingGem = memo(function FloatingGem({ delay, left }: { delay: number; left: string }) {
  return (
    <div
      className="absolute animate-float-slow pointer-events-none"
      style={{ animationDelay: `${delay}s`, left, top: '20%' }}
    >
      <Diamond size={14} className="text-gold/20" fill="#F5B800" />
    </div>
  );
});

const footerLinks1 = [
  { to: '/explore', label: '探索校园' },
  { to: '/heroes', label: '英雄人物' },
  { to: '/quiz', label: '知识挑战' },
  { to: '/map', label: '魔法地图' },
];

const footerLinks2 = [
  { icon: <Trophy size={14} />, label: '答对10题得证书' },
  { icon: <MapPin size={14} />, label: '在地图中找到隐藏宝石' },
  { icon: <Users size={14} />, label: '认识所有传奇英雄' },
  { icon: <BookOpen size={14} />, label: '阅读所有趣味知识' },
];

export default function Footer() {
  return (
    <footer className="relative bg-ink text-white overflow-hidden">
      {/* Floating gem particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }, (_, i) => (
          <FloatingGem key={i} delay={i * 0.5} left={`${10 + i * 16}%`} />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center -space-x-1">
                <BookOpen className="text-gold" size={22} />
                <Swords className="text-gold" size={20} />
              </div>
              <span className="font-display text-xl text-gold">剑桥大冒险</span>
            </div>
            <p className="text-white/70 font-body text-sm leading-relaxed">
              一场为7-14岁小朋友设计的魔法冒险！探索剑桥大学，收集知识宝石，认识改变世界的天才们，完成挑战成为剑桥小达人！
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg text-gold mb-4">快速导航</h4>
            <ul className="space-y-2">
              {footerLinks1.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/70 hover:text-gold transition-colors font-body text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Earn Gems */}
          <div>
            <h4 className="font-display text-lg text-gold mb-4">赚取更多宝石</h4>
            <ul className="space-y-2">
              {footerLinks2.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-white/70 font-body text-sm">
                  <span className="text-gold">{item.icon}</span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <div className="flex items-center justify-center gap-1 text-white/50 font-body text-sm italic">
            <Star size={14} className="text-gold/50" />
            <span>Made for young explorers</span>
            <Star size={14} className="text-gold/50" />
          </div>
          <p className="text-white/30 font-body text-xs mt-2">剑桥大冒险  2025</p>
        </div>
      </div>
    </footer>
  );
}

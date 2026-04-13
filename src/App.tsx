/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Info, 
  FileText, 
  Home, 
  CreditCard,
  ChevronRight,
  Menu,
  X,
  Heart,
  ShieldCheck,
  Users
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const mortuaryData = [
  { id: 1, name: "김*수", room: "특1호실", date: "2024.04.15 09:00", status: "입관중" },
  { id: 2, name: "이*자", room: "201호", date: "2024.04.14 11:30", status: "빈소안내" },
  { id: 3, name: "박*호", room: "302호", date: "2024.04.16 08:00", status: "발인예정" },
  { id: 4, name: "최*영", room: "501호", date: "2024.04.15 13:00", status: "빈소안내" },
];

const quickLinks = [
  { title: "장례절차", icon: <FileText className="w-5 h-5" />, color: "bg-slate-100" },
  { title: "시설안내", icon: <Home className="w-5 h-5" />, color: "bg-slate-100" },
  { title: "비용안내", icon: <CreditCard className="w-5 h-5" />, color: "bg-slate-100" },
  { title: "오시는길", icon: <MapPin className="w-5 h-5" />, color: "bg-slate-100" },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark selection:bg-brand-dark selection:text-white">
      {/* Top Bar */}
      <div className="hidden lg:block bg-brand-dark text-brand-beige py-2 text-xs font-medium border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> 24시 상담: 063-453-4444</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> 전북 군산시 잠두1길 49</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">로그인</a>
            <a href="#" className="hover:text-white transition-colors">부고장 작성</a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 lg:top-8 w-full z-50 transition-all duration-300 ${scrolled ? "lg:top-0 bg-white shadow-md py-2" : "bg-transparent py-4"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 bg-white/90 backdrop-blur-sm lg:rounded-xl shadow-lg px-6 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-dark rounded-lg flex items-center justify-center shadow-inner">
                <span className="text-brand-beige font-heading text-lg font-bold">誠</span>
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-brand-dark">군산시민장례문화원</span>
            </div>
            
            <div className="hidden md:flex items-center gap-10 font-bold text-sm tracking-tight">
              <a href="#" className="hover:text-blue-600 transition-colors">실시간 빈소 현황</a>
              <a href="#" className="hover:text-blue-600 transition-colors">장례안내</a>
              <a href="#" className="hover:text-blue-600 transition-colors">시설안내</a>
              <a href="#" className="hover:text-blue-600 transition-colors">사이버추모관</a>
              <Button className="bg-brand-dark text-brand-beige hover:bg-slate-800 rounded-lg px-6">
                상담문의
              </Button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-brand-dark">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-slate-200 px-4 py-6 flex flex-col gap-4 shadow-xl"
          >
            <a href="#" className="text-lg font-bold px-4 py-2 hover:bg-slate-50 rounded-lg">실시간 빈소</a>
            <a href="#" className="text-lg font-bold px-4 py-2 hover:bg-slate-50 rounded-lg">장례안내</a>
            <a href="#" className="text-lg font-bold px-4 py-2 hover:bg-slate-50 rounded-lg">시설안내</a>
            <Button className="w-full bg-brand-dark text-brand-beige py-6 text-lg">24시 상담문의</Button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-[75vh] min-h-[650px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=2070" 
            alt="Nature Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-brand-dark/40 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-6 px-4 py-1 text-sm backdrop-blur-sm">
              Gunsan Citizen Funeral Culture Center
            </Badge>
            <h1 className="font-heading text-5xl md:text-7xl mb-8 leading-[1.15] font-bold">
              가장 소중한 분의<br />
              <span className="text-blue-300">마지막 여정</span>을<br />
              함께하겠습니다.
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-10 font-medium leading-relaxed max-w-lg">
              군산시민장례문화원은 유가족의 슬픔을 진심으로 위로하며 
              품격 있는 장례 문화를 선도합니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-brand-dark hover:bg-slate-100 px-10 py-7 text-lg font-bold rounded-xl shadow-lg">
                실시간 빈소현황
              </Button>
              <Button size="lg" variant="outline" className="bg-black/20 border-2 border-white/60 text-white hover:bg-white hover:text-brand-dark px-10 py-7 text-lg font-bold rounded-xl backdrop-blur-md transition-all duration-300">
                시설 및 서비스
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Quick Access Floating Panel */}
        <div className="absolute bottom-0 left-0 w-full z-20 translate-y-1/2 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-[2rem] shadow-2xl p-8 grid grid-cols-4 gap-8 border border-slate-100">
              {quickLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-5 group cursor-pointer">
                  <div className={`w-14 h-14 ${link.color} rounded-2xl flex items-center justify-center group-hover:bg-brand-dark group-hover:text-white transition-all duration-300`}>
                    {link.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{link.title}</h4>
                    <p className="text-xs text-slate-400 font-medium">자세히 보기</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mortuary Status Section */}
      <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">실시간 빈소 현황</h2>
            <p className="text-slate-500 font-medium">현재 진행 중인 장례 일정을 실시간으로 안내해 드립니다.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Last Updated</p>
              <p className="font-bold text-slate-700">2024.04.13 18:50</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mortuaryData.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all duration-500 flex flex-col sm:flex-row gap-8 items-center">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl font-bold text-brand-dark border border-slate-100 group-hover:bg-brand-dark group-hover:text-white transition-colors">
                  {item.room.replace("호실", "").replace("호", "")}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                    <Badge className="bg-blue-600 hover:bg-blue-700 rounded-full px-3">{item.room}</Badge>
                    <Badge variant="outline" className="border-slate-300 text-slate-500 rounded-full px-3">{item.status}</Badge>
                  </div>
                  <h3 className="text-3xl font-bold mb-3">故 {item.name} 님</h3>
                  <p className="text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-2">
                    <Clock className="w-4 h-4" /> 발인: {item.date}
                  </p>
                </div>
                <Button className="bg-white text-brand-dark border border-slate-200 hover:bg-brand-dark hover:text-white rounded-2xl px-8 py-6 font-bold shadow-sm">
                  부고보기
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl px-12 py-7 font-bold text-lg">
            전체 빈소현황 보기 <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Features / Why Us */}
      <section className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-4xl font-bold mb-8 leading-tight">
                군산시민장례문화원만의<br />
                <span className="text-blue-600">특별한 약속</span>
              </h2>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                우리는 단순한 장례 시설을 넘어, 고인에 대한 예우와 유가족의 
                치유를 최우선으로 생각합니다.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                    <Heart className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-lg">진심을 다하는 정성</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-lg">투명하고 정직한 비용</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-lg">전문 장례 지도사 상주</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500">
                <h3 className="text-2xl font-bold mb-4">최신식 편의시설</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  유가족과 조문객 모두가 편안하게 머무를 수 있도록 쾌적하고 
                  현대적인 휴게 공간과 식당을 운영합니다.
                </p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500">
                <h3 className="text-2xl font-bold mb-4">모바일 부고 서비스</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  언제 어디서든 신속하게 소식을 전할 수 있는 스마트 부고장 
                  시스템을 무료로 제공해 드립니다.
                </p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500">
                <h3 className="text-2xl font-bold mb-4">24시 긴급 출동</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  임종 시 연락 주시면 즉시 앰뷸런스 출동 및 장례 절차를 
                  원스톱으로 도와드립니다.
                </p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500">
                <h3 className="text-2xl font-bold mb-4">사이버 추모관</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  직접 방문하지 못하는 분들을 위해 온라인으로 헌화와 
                  추모의 글을 남길 수 있는 공간입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-brand-dark rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 border border-white rounded-full" />
            <div className="absolute bottom-10 right-10 w-96 h-96 border border-white rounded-full" />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              도움이 필요하신가요?<br />
              <span className="text-blue-300">365일 24시간</span> 언제든 열려있습니다.
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href="tel:063-453-4444" className="bg-white text-brand-dark hover:bg-slate-100 px-12 py-6 text-2xl font-bold rounded-2xl shadow-xl flex items-center gap-4 transition-all">
                <Phone className="w-8 h-8" /> 063-453-4444
              </a>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-12 py-6 text-xl font-bold rounded-2xl h-auto">
                온라인 상담문의
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-white font-heading text-lg font-bold">誠</span>
                </div>
                <span className="font-heading text-2xl font-bold tracking-tight text-white">군산시민장례문화원</span>
              </div>
              <p className="max-w-md mb-10 leading-relaxed text-slate-500 font-medium">
                우리는 고인의 마지막 여정이 품격 있고 평온하기를 바랍니다. 
                유가족의 슬픔을 함께 나누며 가장 힘든 순간에 정성을 다해 함께하겠습니다.
              </p>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                  <Info className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">Contact</h4>
              <ul className="space-y-5 text-sm font-medium">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
                  <span>54044 군산시 잠두1길 49</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 shrink-0 text-blue-400" />
                  <span>T. 063-453-4444</span>
                </li>
                <li className="flex items-center gap-3">
                  <FileText className="w-4 h-4 shrink-0 text-blue-400" />
                  <span>F. 063-443-3111</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">Menu</h4>
              <ul className="space-y-5 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">실시간 빈소현황</a></li>
                <li><a href="#" className="hover:text-white transition-colors">장례절차 안내</a></li>
                <li><a href="#" className="hover:text-white transition-colors">시설 및 비용안내</a></li>
                <li><a href="#" className="hover:text-white transition-colors">개인정보처리방침</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="bg-white/5 mb-10" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold tracking-wider text-slate-600">
            <p>© 2024 GUNSAN CITIZEN FUNERAL CULTURE CENTER. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              <span>사업자등록번호: 123-45-67890</span>
              <span>대표자: 홍길동</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

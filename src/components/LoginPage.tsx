import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useVoiceGuide } from '../contexts/VoiceGuideContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { speak } = useVoiceGuide();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - just navigate back
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Back Button - Top Left */}
      <div className="absolute top-4 left-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/')}
          onMouseEnter={() => speak('뒤로가기')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="mb-2">로그인</h1>
          <p className="text-muted-foreground">
            계정에 로그인하세요
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2">사용자</label>
            <Input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => speak('사용자 입력')}
              required
            />
          </div>
          <div>
            <label className="block mb-2">비밀번호</label>
            <Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => speak('비밀번호 입력')}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            onMouseEnter={() => speak('로그인하기')}
          >
            로그인
          </Button>
        </form>
      </Card>
    </div>
  );
}
import React, { useState, useCallback } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiPower, FiClock } from 'react-icons/fi';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Calendar,
  Section,
  Appointment,
} from './styles';

import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="Barbershop" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Welcome,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>

        <Content>
          <Schedule>
            <h1>Horários agendados</h1>
            <p>
              <span>Hoje</span>
              <span>Dia 06</span>
              <span>Segunda-feira</span>
            </p>

            <NextAppointment>
              <strong>Atendimento a seguir</strong>
              <div>
                <img
                  src="https://avatars3.githubusercontent.com/u/3421410?s=400&u=38322b93a4819d8e8a69e49b7d9233a508930fdc&v=4"
                  alt="Pablo Satler"
                />
                <strong>Pablo Satler</strong>
                <span>
                  <FiClock />
                  08:00
                </span>
              </div>
            </NextAppointment>

            <Section>
              <strong>Manhã</strong>

              <Appointment>
                <span>
                  <FiClock />
                  08:00
                </span>

                <div>
                  <img
                    src="https://avatars3.githubusercontent.com/u/3421410?s=400&u=38322b93a4819d8e8a69e49b7d9233a508930fdc&v=4"
                    alt="Pablo Satler"
                  />

                  <strong>Pablo Satler</strong>
                </div>
              </Appointment>

              <Appointment>
                <span>
                  <FiClock />
                  08:00
                </span>

                <div>
                  <img
                    src="https://avatars3.githubusercontent.com/u/3421410?s=400&u=38322b93a4819d8e8a69e49b7d9233a508930fdc&v=4"
                    alt="Pablo Satler"
                  />

                  <strong>Pablo Satler</strong>
                </div>
              </Appointment>
            </Section>

            <Section>
              <strong>Tarde</strong>

              <Appointment>
                <span>
                  <FiClock />
                  08:00
                </span>

                <div>
                  <img
                    src="https://avatars3.githubusercontent.com/u/3421410?s=400&u=38322b93a4819d8e8a69e49b7d9233a508930fdc&v=4"
                    alt="Pablo Satler"
                  />

                  <strong>Pablo Satler</strong>
                </div>
              </Appointment>
            </Section>
          </Schedule>

          <Calendar>
            <DayPicker
              weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
              fromMonth={new Date()}
              disabledDays={[
                {
                  daysOfWeek: [0, 6], // disabling sunday and saturday
                },
              ]}
              modifiers={{
                available: {
                  daysOfWeek: [1, 2, 3, 4, 5],
                },
              }}
              selectedDays={selectedDate}
              onDayClick={handleDateChange}
              months={[
                'Janeiro',
                'Fevereiro',
                'Março',
                'Abril',
                'Maio',
                'Junho',
                'Julho',
                'Agosto',
                'Setembro',
                'Outubro',
                'Novembro',
                'Dezembro',
              ]}
            />
          </Calendar>
        </Content>
      </Header>
    </Container>
  );
};

export default Dashboard;

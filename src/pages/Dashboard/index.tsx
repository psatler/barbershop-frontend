import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
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
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(
    function getCurrentMonthAvailability() {
      api
        .get(`/providers/${user.id}/month-availability`, {
          params: {
            year: currentMonth.getFullYear(),
            month: currentMonth.getMonth() + 1, // JS months starts at zero
          },
        })
        .then(response => {
          setMonthAvailability(response.data);
        });
    },
    [currentMonth, user.id],
  );

  useEffect(
    function loadAppointmentsOnSelectedDate() {
      api
        .get('/appointments/me', {
          params: {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth() + 1,
            day: selectedDate.getDate(),
          },
        })
        .then(response => {
          setAppointments(response.data);

          console.log(response.data);
        });
    },
    [selectedDate],
  );

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(dayOfTheMonth => dayOfTheMonth.available === false)
      .map(dayOfTheMonth => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        return new Date(year, month, dayOfTheMonth.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: ptBR,
    });
  }, [selectedDate]);

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
              {isToday(selectedDate) && <span>Hoje</span>}
              <span>{selectedDateAsText}</span>
              <span>{selectedWeekDay}</span>
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
                ...disabledDays,
              ]}
              modifiers={{
                available: {
                  daysOfWeek: [1, 2, 3, 4, 5],
                },
              }}
              selectedDays={selectedDate}
              onDayClick={handleDateChange}
              onMonthChange={handleMonthChange}
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

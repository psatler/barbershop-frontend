import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiPower, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';
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
import avatarPlaceholder from '../../assets/avatar-placeholder.png';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hourFormatted: string;
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
    if (modifiers.available && !modifiers.disabled) {
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
        })
        .catch((error: AxiosError) => {
          // https://stackoverflow.com/questions/47216452/how-to-handle-401-authentication-error-in-axios-and-react
          if (error.response?.status === 401) {
            signOut();
          }
        });
    },
    [currentMonth, user.id, signOut],
  );

  useEffect(
    function loadAppointmentsOnSelectedDate() {
      api
        .get<Appointment[]>('/appointments/me', {
          params: {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth() + 1,
            day: selectedDate.getDate(),
          },
        })
        .then(response => {
          const appointmentsFormatted = response.data.map(appointment => {
            return {
              ...appointment,
              hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
            };
          });

          setAppointments(appointmentsFormatted);
        })
        .catch((error: AxiosError) => {
          if (error.response?.status === 401) {
            signOut();
          }
        });
    },
    [selectedDate, signOut],
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

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    // get the next appointment where the date is after now
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date()),
    );
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="Barbershop" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Welcome,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
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

            {isToday(selectedDate) && nextAppointment && (
              <NextAppointment>
                <strong>Agendamento a seguir</strong>
                <div>
                  <img
                    src={nextAppointment?.user.avatar_url ?? avatarPlaceholder}
                    alt={nextAppointment.user.name}
                  />
                  <strong>{nextAppointment.user.name}</strong>
                  <span>
                    <FiClock />
                    {nextAppointment.hourFormatted}
                  </span>
                </div>
              </NextAppointment>
            )}

            <Section>
              <strong>Manhã</strong>

              {morningAppointments.length === 0 && (
                <p>Nenhum agendamento neste período</p>
              )}

              {morningAppointments.map(appointment => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.hourFormatted}
                  </span>

                  <div>
                    <img
                      src={appointment.user.avatar_url ?? avatarPlaceholder}
                      alt={appointment.user.name}
                    />

                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
              ))}
            </Section>

            <Section>
              <strong>Tarde</strong>

              {afternoonAppointments.length === 0 && (
                <p>Nenhum agendamento neste período</p>
              )}

              {afternoonAppointments.map(appointment => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.hourFormatted}
                  </span>

                  <div>
                    <img
                      src={appointment.user.avatar_url ?? avatarPlaceholder}
                      alt={appointment.user.name}
                    />

                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
              ))}
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
